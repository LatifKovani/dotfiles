import { createState } from "ags"
import Mpris from "gi://AstalMpris"
import { Gtk } from "ags/gtk4"

function truncate(str: string, max: number) {
  return str && str.length > max ? str.slice(0, max) + "…" : str || ""
}

function PlayerView({ player }: { player: Mpris.Player }) {
  const [title, setTitle] = createState(player.title || "")
  const [artist, setArtist] = createState(player.artist || "")
  const [playing, setPlaying] = createState(
    player.playbackStatus === Mpris.PlaybackStatus.PLAYING,
  )

  player.connect("notify::title", () => setTitle(player.title || ""))
  player.connect("notify::artist", () => setArtist(player.artist || ""))
  player.connect("notify::playback-status", () =>
    setPlaying(player.playbackStatus === Mpris.PlaybackStatus.PLAYING),
  )

  return (
    <box cssClasses={["nc-media-player"]} spacing={12}>
      <box cssClasses={["nc-media-art-container"]}>
        <label cssClasses={["nc-media-art-fallback"]} label="󰎇" />
      </box>
      <box
        orientation={Gtk.Orientation.VERTICAL}
        hexpand
        valign={Gtk.Align.CENTER}
        spacing={2}
      >
        <label
          cssClasses={["nc-media-title"]}
          label={title((t: string) => truncate(t, 28))}
          halign={Gtk.Align.START}
          xalign={0}
        />
        <label
          cssClasses={["nc-media-artist"]}
          label={artist((a: string) => truncate(a, 28))}
          halign={Gtk.Align.START}
          xalign={0}
        />
        <box
          cssClasses={["nc-media-controls"]}
          spacing={4}
          halign={Gtk.Align.START}
        >
          <button
            cssClasses={["nc-media-btn"]}
            label="󰒮"
            onClicked={() => player.previous()}
          />
          <button
            cssClasses={["nc-media-btn", "play"]}
            label={playing((p: boolean) => (p ? "󰏤" : "󰐊"))}
            onClicked={() => player.play_pause()}
          />
          <button
            cssClasses={["nc-media-btn"]}
            label="󰒭"
            onClicked={() => player.next()}
          />
        </box>
      </box>
    </box>
  )
}

function EmptyMedia() {
  return (
    <box cssClasses={["nc-media-empty"]} halign={Gtk.Align.CENTER} spacing={8}>
      <label cssClasses={["nc-media-empty-icon"]} label="󰝛" />
      <label cssClasses={["nc-media-empty-label"]} label="Nothing playing" />
    </box>
  )
}

export default function MediaPlayer() {
  const mpris = Mpris.get_default()
  const [players, setPlayers] = createState<Mpris.Player[]>([...mpris.players])

  mpris.connect("notify::players", () => setPlayers([...mpris.players]))

  return (
    <box cssClasses={["nc-media"]} orientation={Gtk.Orientation.VERTICAL}>
      {players((ps: Mpris.Player[]) =>
        ps.length === 0 ? <EmptyMedia /> : <PlayerView player={ps[0]} />,
      )}
    </box>
  )
}
