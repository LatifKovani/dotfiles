import Wp from "gi://AstalWp"
import { createBinding } from "ags"

function volumeIcon(vol: number): string {
  if (vol === 0) return "󰝟"
  if (vol < 0.33) return "󰕿"
  if (vol < 0.66) return "󰖀"
  return "󰕾"
}

export default function Audio() {
  const audio = Wp.get_default()?.audio
  if (!audio) return <box />

  const speaker = audio.defaultSpeaker
  const volume = createBinding(speaker, "volume")

  return (
    <box cssClasses={["audio"]} spacing={4}>
      <label cssClasses={["audio-icon"]} label={volume((v) => volumeIcon(v))} />
      <label
        cssClasses={["audio-label"]}
        label={volume((v) => `${Math.round(v * 100)}%`)}
      />
    </box>
  )
}
