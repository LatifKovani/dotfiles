import Wp from "gi://AstalWp"
import { createState } from "ags"
import { Gtk } from "ags/gtk4"
import GLib from "gi://GLib"

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
    const [ok, curOut] = GLib.spawn_command_line_sync("brightnessctl get")
    const [ok2, maxOut] = GLib.spawn_command_line_sync("brightnessctl max")
    if (ok && ok2 && curOut && maxOut) {
      const cur = parseInt(new TextDecoder().decode(curOut).trim())
      const max = parseInt(new TextDecoder().decode(maxOut).trim())
      if (max > 0) return cur / max
    }
  } catch (_) {}
  return 0.5
}

function VolumeSlider() {
  const audio = Wp.get_default()?.audio
  const speaker = audio?.defaultSpeaker
  if (!speaker) return <box />

  const [vol, setVol] = createState(speaker.volume)
  const [ico, setIco] = createState(volumeIcon(speaker.volume, speaker.mute))

  speaker.connect("notify::volume", () => {
    setVol(speaker.volume)
    setIco(volumeIcon(speaker.volume, speaker.mute))
  })
  speaker.connect("notify::mute", () => {
    setIco(volumeIcon(speaker.volume, speaker.mute))
  })

  return (
    <box
      cssClasses={["nc-slider-card"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
      hexpand
    >
      <box spacing={6}>
        <label cssClasses={["nc-slider-icon"]} label={ico} />
        <label
          cssClasses={["nc-slider-card-title"]}
          label="Sound"
          hexpand
          halign={Gtk.Align.START}
        />
        <label
          cssClasses={["nc-slider-value"]}
          label={vol((v: number) => `${Math.round(v * 100)}%`)}
        />
      </box>
      <slider
        cssClasses={["nc-slider"]}
        hexpand
        min={0}
        max={1}
        value={vol}
        valign={Gtk.Align.CENTER}
        onChangeValue={(self: any) => {
          speaker.volume = self.value
          setVol(self.value)
          setIco(volumeIcon(self.value, speaker.mute))
        }}
      />
    </box>
  )
}

function BrightnessSlider() {
  const [brightness, setBrightness] = createState(getBrightness())
  const [ico, setIco] = createState(brightnessIcon(getBrightness()))

  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
    const b = getBrightness()
    setBrightness(b)
    setIco(brightnessIcon(b))
    return GLib.SOURCE_CONTINUE
  })

  return (
    <box
      cssClasses={["nc-slider-card"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
      hexpand
    >
      <box spacing={6}>
        <label cssClasses={["nc-slider-icon"]} label={ico} />
        <label
          cssClasses={["nc-slider-card-title"]}
          label="Display"
          hexpand
          halign={Gtk.Align.START}
        />
        <label
          cssClasses={["nc-slider-value"]}
          label={brightness((b: number) => `${Math.round(b * 100)}%`)}
        />
      </box>
      <slider
        cssClasses={["nc-slider"]}
        hexpand
        min={0}
        max={1}
        value={brightness}
        valign={Gtk.Align.CENTER}
        onChangeValue={(self: any) => {
          const pct = Math.round(self.value * 100)
          setBrightness(self.value)
          setIco(brightnessIcon(self.value))
          GLib.spawn_command_line_async(`brightnessctl set ${pct}%`)
        }}
      />
    </box>
  )
}

export default function Sliders() {
  return (
    <box cssClasses={["nc-sliders"]} spacing={8} homogeneous>
      <VolumeSlider />
      <BrightnessSlider />
    </box>
  )
}
