import Mpris from "gi://AstalMpris"
import GLib from "gi://GLib"
import { createState } from "ags"
import { Gtk } from "ags/gtk4"

function getPlayers(mpris: any): any[] {
  try {
    const p = mpris.players
    if (!p) return []
    if (Array.isArray(p)) return p
    if (typeof p.get_n_items === "function") {
      const arr: any[] = []
      for (let i = 0; i < p.get_n_items(); i++) arr.push(p.get_item(i))
      return arr
    }
  } catch (_) {}
  return []
}

export default function MediaPlayerCard() {
  const mpris = Mpris.get_default() as any

  const [title, setTitle] = createState("Nothing Playing")
  const [artist, setArtist] = createState("")
  const [isPlaying, setIsPlaying] = createState(false)
  const [hasPlayer, setHasPlayer] = createState(false)

  let currentPlayer: any = null

  function updateFromPlayer(player: any) {
    if (!player) {
      setTitle("Nothing Playing")
      setArtist("")
      setIsPlaying(false)
      setHasPlayer(false)
      return
    }
    setHasPlayer(true)
    setTitle(player.title || "Unknown Title")
    setArtist(player.artist || "")
    try {
      const status = player.playback_status
      const playing =
        status === Mpris.PlaybackStatus.PLAYING ||
        String(status).toUpperCase().includes("PLAYING") ||
        Number(status) === 1
      setIsPlaying(playing)
    } catch (_) {
      setIsPlaying(false)
    }
  }

  function refreshPlayer() {
    const players = getPlayers(mpris)
    // Prefer the currently-playing player
    let preferred: any = null
    try {
      preferred = players.find((p: any) => {
        const s = p.playback_status
        return (
          s === Mpris.PlaybackStatus.PLAYING ||
          String(s).toUpperCase().includes("PLAYING") ||
          Number(s) === 1
        )
      })
    } catch (_) {}
    currentPlayer = preferred ?? players[0] ?? null
    updateFromPlayer(currentPlayer)
  }

  // Watch existing players
  for (const p of getPlayers(mpris)) {
    try {
      p.connect("notify::title", refreshPlayer)
      p.connect("notify::artist", refreshPlayer)
      p.connect("notify::playback-status", refreshPlayer)
    } catch (_) {}
  }

  // Watch new / removed players
  try {
    mpris.connect("player-added", (_: any, player: any) => {
      try {
        player.connect("notify::title", refreshPlayer)
        player.connect("notify::artist", refreshPlayer)
        player.connect("notify::playback-status", refreshPlayer)
      } catch (_) {}
      refreshPlayer()
    })
    mpris.connect("player-closed", () => {
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 300, () => {
        refreshPlayer()
        return GLib.SOURCE_REMOVE
      })
    })
  } catch (_) {}

  refreshPlayer()

  // Fallback poll every 3 s
  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 3000, () => {
    refreshPlayer()
    return GLib.SOURCE_CONTINUE
  })

  return (
    <box
      cssClasses={["nc-media-card"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={10}
      widthRequest={190}
    >
      {/* Art placeholder */}
      <box cssClasses={["nc-media-art"]} halign={Gtk.Align.CENTER}>
        <label
          cssClasses={["nc-media-art-icon"]}
          label={hasPlayer((h: boolean) => (h ? "󰎇" : "󰎊"))}
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
        />
      </box>

      {/* Title + Artist */}
      <box orientation={Gtk.Orientation.VERTICAL} spacing={2}>
        <label
          cssClasses={["nc-media-title"]}
          label={title}
          halign={Gtk.Align.CENTER}
          maxWidthChars={17}
          $={(self: Gtk.Label) => self.set_ellipsize(3)}
        />
        <label
          cssClasses={["nc-media-artist"]}
          label={artist((a: string) => a || " ")}
          halign={Gtk.Align.CENTER}
          maxWidthChars={17}
          $={(self: Gtk.Label) => self.set_ellipsize(3)}
        />
      </box>

      {/* Controls */}
      <box
        halign={Gtk.Align.CENTER}
        spacing={20}
        valign={Gtk.Align.END}
        vexpand
      >
        <button
          cssClasses={["nc-media-btn"]}
          label="󰒮"
          sensitive={hasPlayer}
          onClicked={() => {
            try {
              currentPlayer?.previous?.()
            } catch (_) {}
          }}
        />
        <button
          cssClasses={["nc-media-btn", "nc-media-btn-play"]}
          label={isPlaying((p: boolean) => (p ? "󰏤" : "󰐊"))}
          sensitive={hasPlayer}
          onClicked={() => {
            try {
              currentPlayer?.play_pause?.()
            } catch (_) {}
          }}
        />
        <button
          cssClasses={["nc-media-btn"]}
          label="󰒭"
          sensitive={hasPlayer}
          onClicked={() => {
            try {
              currentPlayer?.next?.()
            } catch (_) {}
          }}
        />
      </box>
    </box>
  )
}
