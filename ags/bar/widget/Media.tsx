import { createPoll } from "ags/time"
import GLib from "gi://GLib"

export default function Media() {
  const status = createPoll("", 2000, "playerctl status 2>/dev/null || echo ''")

  const text = createPoll(
    "",
    2000,
    'bash -c "artist=$(playerctl metadata artist 2>/dev/null); title=$(playerctl metadata title 2>/dev/null); if [ -n \\"$artist\\" ]; then echo \\"$artist — $title\\"; else echo \\"$title\\"; fi"',
  )

  const isPlaying = status((s) => s.trim() === "Playing")
  const playIcon = status((s) => (s.trim() === "Playing" ? "󰏤" : "󰐊"))

  return (
    <box cssClasses={["media"]} spacing={4} visible={isPlaying}>
      <label cssClasses={["media-icon"]} label="󰎆" />
      <label
        cssClasses={["media-label"]}
        maxWidthChars={35}
        ellipsize={3}
        label={text}
      />
      <button
        cssClasses={["media-btn"]}
        onClicked={() =>
          GLib.spawn_command_line_async(
            "playerctl play-pause 2>/dev/null || true",
          )
        }
        label={playIcon}
      />
      <button
        cssClasses={["media-btn"]}
        onClicked={() =>
          GLib.spawn_command_line_async("playerctl next 2>/dev/null || true")
        }
        label="󰒭"
      />
    </box>
  )
}
