import { Astal, Gtk } from "ags/gtk4"
import Wp from "gi://AstalWp"
import { createState } from "ags"
import GLib from "gi://GLib"

let hideTimeout: number | null = null

function scheduleHide(setVisible: (v: boolean) => void) {
  if (hideTimeout) GLib.source_remove(hideTimeout)
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

function brightnessIcon(val: number): string {
  if (val < 0.33) return "󰃞"
  if (val < 0.66) return "󰃟"
  return "󰃠"
}

function getBrightness(): number {
  try {
    const [ok, out] = GLib.spawn_command_line_sync(
      "bash -c 'echo $(brightnessctl get)/$(brightnessctl max) | bc -l'",
    )
    if (ok && out) return parseFloat(new TextDecoder().decode(out).trim())
  } catch (_) { }
  return 0.5
}

export default function OSD() {
  const [visible, setVisible] = createState(false)
  const [value, setValue] = createState(0)
  const [icon, setIcon] = createState("󰕾")

  const audio = Wp.get_default()?.audio
  if (audio) {
    const speaker = audio.defaultSpeaker
    speaker.connect("notify::volume", () => {
      setValue(speaker.mute ? 0 : speaker.volume)
      setIcon(volumeIcon(speaker.volume, speaker.mute))
      setVisible(true)
      scheduleHide(setVisible)
    })
    speaker.connect("notify::mute", () => {
      setValue(speaker.mute ? 0 : speaker.volume)
      setIcon(volumeIcon(speaker.volume, speaker.mute))
      setVisible(true)
      scheduleHide(setVisible)
    })
  }

  let lastBrightness = -1
  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 300, () => {
    const pct = getBrightness()
    if (Math.abs(pct - lastBrightness) > 0.01) {
      lastBrightness = pct
      setValue(pct)
      setIcon(brightnessIcon(pct))
      setVisible(true)
      scheduleHide(setVisible)
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
        cssClasses={["osd-container"]}
        spacing={14}
        halign={Gtk.Align.CENTER}
      >
        <label cssClasses={["osd-icon"]} label={icon} />
        <levelbar
          cssClasses={["osd-bar"]}
          value={value}
          minValue={0}
          maxValue={1}
          widthRequest={180}
          valign={Gtk.Align.CENTER}
        />
        <label
          cssClasses={["osd-label"]}
          label={value((v: number) => `${Math.round(v * 100)}%`)}
        />
      </box>
    </window>
  )
}
