import { Astal, Gtk } from "ags/gtk4"
import Wp from "gi://AstalWp"
import { createState } from "ags"
import GLib from "gi://GLib"

let hideTimeout: number | null = null
function scheduleHide(setVisible: (v: boolean) => void) {
  if (hideTimeout !== null) GLib.source_remove(hideTimeout)
  hideTimeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1500, () => {
    setVisible(false)
    hideTimeout = null
    return GLib.SOURCE_REMOVE
  })
}

function volumeIcon(vol: number, muted: boolean): string {
  if (muted || vol === 0) return "󰝟"
  if (vol < 0.33) return "󰕿"
  if (vol < 0.66) return "󰖀"
  return "󰕾"
}
function micIcon(muted: boolean): string {
  return muted ? "󰍭" : "󰍬"
}
function brightnessIcon(val: number): string {
  if (val < 0.33) return "󰃞"
  if (val < 0.66) return "󰃟"
  return "󰃠"
}

function getBrightness(): number {
  const candidates = [
    "/sys/class/backlight/intel_backlight",
    "/sys/class/backlight/amdgpu_bl0",
    "/sys/class/backlight/amdgpu_bl1",
    "/sys/class/backlight/acpi_video0",
    "/sys/class/backlight/acpi_video1",
  ]
  for (const base of candidates) {
    try {
      const [ok1, curBytes] = GLib.file_get_contents(`${base}/brightness`)
      const [ok2, maxBytes] = GLib.file_get_contents(`${base}/max_brightness`)
      if (ok1 && ok2 && curBytes && maxBytes) {
        const cur = parseInt(new TextDecoder().decode(curBytes).trim())
        const max = parseInt(new TextDecoder().decode(maxBytes).trim())
        if (max > 0) return cur / max
      }
    } catch (_) {}
  }
  return 0.5
}

function getCapsLock(): boolean {
  const candidates = [
    "/sys/class/leds/input0::capslock/brightness",
    "/sys/class/leds/input1::capslock/brightness",
    "/sys/class/leds/input2::capslock/brightness",
    "/sys/class/leds/input3::capslock/brightness",
    "/sys/class/leds/input4::capslock/brightness",
    "/sys/class/leds/input5::capslock/brightness",
  ]
  for (const p of candidates) {
    try {
      const [ok, data] = GLib.file_get_contents(p)
      if (ok && data) return new TextDecoder().decode(data).trim() === "1"
    } catch (_) {}
  }
  return false
}

type Mode = "volume" | "brightness" | "mic" | "capslock"

export default function OSD() {
  const [visible, setVisible] = createState(false)
  const [mode, setMode] = createState<Mode>("volume")
  const [value, setValue] = createState(0)
  const [icon, setIcon] = createState("󰕾")
  const [capsOn, setCapsOn] = createState(false)

  let ready = false
  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 3000, () => {
    ready = true
    return GLib.SOURCE_REMOVE
  })

  function show(m: Mode) {
    if (!ready) return
    setMode(m)
    setVisible(true)
    scheduleHide(setVisible)
  }

  const audio = Wp.get_default()?.audio
  if (audio) {
    const speaker = audio.defaultSpeaker
    if (speaker) {
      speaker.connect("notify::volume", () => {
        setValue(speaker.mute ? 0 : speaker.volume)
        setIcon(volumeIcon(speaker.volume, speaker.mute))
        show("volume")
      })
      speaker.connect("notify::mute", () => {
        setValue(speaker.mute ? 0 : speaker.volume)
        setIcon(volumeIcon(speaker.volume, speaker.mute))
        show("volume")
      })
    }
    const mic = audio.defaultMicrophone
    if (mic) {
      mic.connect("notify::mute", () => {
        setValue(mic.mute ? 0 : 1)
        setIcon(micIcon(mic.mute))
        show("mic")
      })
    }
  }

  let lastBri = getBrightness()
  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 200, () => {
    const b = getBrightness()
    if (Math.abs(b - lastBri) > 0.005) {
      lastBri = b
      setValue(b)
      setIcon(brightnessIcon(b))
      show("brightness")
    }
    return GLib.SOURCE_CONTINUE
  })

  let lastCaps = getCapsLock()
  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 150, () => {
    const caps = getCapsLock()
    if (caps !== lastCaps) {
      lastCaps = caps
      setCapsOn(caps)
      show("capslock")
    }
    return GLib.SOURCE_CONTINUE
  })

  return (
    <window
      cssClasses={["osd-window"]}
      layer={Astal.Layer.OVERLAY}
      anchor={Astal.WindowAnchor.BOTTOM}
      marginBottom={80}
      visible={visible}
      keymode={Astal.Keymode.NONE}
    >
      <box
        cssClasses={["osd-pill"]}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >
        <box
          cssClasses={["osd-bar-row"]}
          spacing={14}
          visible={mode((m: Mode) => m !== "capslock")}
        >
          <label cssClasses={["osd-icon"]} label={icon} />
          <levelbar
            cssClasses={["osd-bar"]}
            value={value}
            minValue={0}
            maxValue={1}
            widthRequest={160}
            valign={Gtk.Align.CENTER}
          />
        </box>

        <box
          cssClasses={["osd-caps-row"]}
          spacing={14}
          visible={mode((m: Mode) => m === "capslock")}
        >
          <label cssClasses={["osd-caps-icon"]} label="󰌌" />
          <label
            cssClasses={["osd-caps-label"]}
            label={capsOn((on: boolean) =>
              on ? "Caps Lock On" : "Caps Lock Off",
            )}
          />
        </box>
      </box>
    </window>
  )
}
