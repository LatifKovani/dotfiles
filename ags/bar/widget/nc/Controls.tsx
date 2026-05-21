import Network from "gi://AstalNetwork"
import Bluetooth from "gi://AstalBluetooth"
import Notifd from "gi://AstalNotifd"
import Wp from "gi://AstalWp"
import GLib from "gi://GLib"
import { Gtk } from "ags/gtk4"
import { createState } from "ags"
import { notify } from "../notify"
import MediaPlayerCard from "./MediaPlayer"

// ─── Night Mode helper ────────────────────────────────────────────────────────
function isWlsunsetRunning(): boolean {
  try {
    const [ok, out] = GLib.spawn_command_line_sync("pgrep -x wlsunset")
    if (ok && out) {
      return new TextDecoder().decode(out as Uint8Array).trim().length > 0
    }
  } catch (_) {}
  return false
}

// ─── WiFi Card ───────────────────────────────────────────────────────────────
function WifiCard() {
  const network = Network.get_default()
  const wifi = network.wifi

  if (!wifi) {
    return (
      <button cssClasses={["nc-card"]} hexpand>
        <box spacing={12} valign={Gtk.Align.CENTER}>
          <label cssClasses={["nc-card-icon"]} label="󰖪" />
          <box orientation={Gtk.Orientation.VERTICAL} spacing={1} hexpand>
            <label
              cssClasses={["nc-card-title"]}
              label="Wi-Fi"
              halign={Gtk.Align.START}
            />
            <label
              cssClasses={["nc-card-subtitle"]}
              label="Unavailable"
              halign={Gtk.Align.START}
            />
          </box>
        </box>
      </button>
    )
  }

  const [ssid, setSsid] = createState(
    wifi.enabled ? wifi.ssid || "Not Connected" : "Off",
  )
  const [enabled, setEnabled] = createState(wifi.enabled)

  wifi.connect("notify::ssid", () => {
    setSsid(wifi.ssid || (wifi.enabled ? "Not Connected" : "Off"))
  })
  wifi.connect("notify::enabled", () => {
    setEnabled(wifi.enabled)
    setSsid(wifi.enabled ? wifi.ssid || "Not Connected" : "Off")
  })

  return (
    <button
      cssClasses={enabled((e: boolean) =>
        e ? ["nc-card", "active"] : ["nc-card"],
      )}
      onClicked={() => {
        const next = !wifi.enabled
        GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
          wifi.enabled = next
          return GLib.SOURCE_REMOVE
        })
      }}
    >
      <box spacing={12} valign={Gtk.Align.CENTER}>
        <label
          cssClasses={["nc-card-icon"]}
          label={enabled((e: boolean) => (e ? "󰖩" : "󰖪"))}
        />
        <box orientation={Gtk.Orientation.VERTICAL} spacing={1}>
          <label
            cssClasses={["nc-card-title"]}
            label="Wi-Fi"
            halign={Gtk.Align.START}
          />
          <label
            cssClasses={["nc-card-subtitle"]}
            label={ssid}
            halign={Gtk.Align.START}
            maxWidthChars={18}
            $={(self: Gtk.Label) => self.set_ellipsize(3)}
          />
        </box>
      </box>
    </button>
  )
}

// ─── Bluetooth Card ──────────────────────────────────────────────────────────
function BtCard() {
  const bt = Bluetooth.get_default()

  function getSubtitle(): string {
    if (!bt.adapter?.powered) return "Off"
    const connected = bt.devices.filter((d: any) => d.connected)
    if (connected.length === 0) return "On"
    return connected.map((d: any) => d.name || "Device").join(", ")
  }

  if (!bt.adapter) {
    return (
      <button cssClasses={["nc-sq-card"]} hexpand>
        <box
          orientation={Gtk.Orientation.VERTICAL}
          spacing={4}
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
        >
          <label cssClasses={["nc-card-icon"]} label="󰂲" />
          <label cssClasses={["nc-card-title"]} label="Bluetooth" />
          <label cssClasses={["nc-card-subtitle"]} label="Off" />
        </box>
      </button>
    )
  }

  const [powered, setPowered] = createState(bt.adapter.powered)
  const [subtitle, setSubtitle] = createState(getSubtitle())

  const update = () => {
    setPowered(bt.adapter!.powered)
    setSubtitle(getSubtitle())
  }

  bt.adapter.connect("notify::powered", update)

  for (const d of bt.devices) {
    try {
      d.connect("notify::connected", update)
    } catch (_) {}
  }

  bt.connect("device-added", (_: any, device: any) => {
    try {
      device.connect("notify::connected", update)
    } catch (_) {}
    update()
  })

  return (
    <button
      cssClasses={powered((p: boolean) =>
        p ? ["nc-sq-card", "active"] : ["nc-sq-card"],
      )}
      hexpand
      onClicked={() => {
        const next = !bt.adapter!.powered
        bt.adapter!.powered = next
        update()
      }}
    >
      <box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={4}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >
        <label
          cssClasses={["nc-card-icon"]}
          label={powered((p: boolean) => (p ? "󰂯" : "󰂲"))}
        />
        <label cssClasses={["nc-card-title"]} label="Bluetooth" />
        <label
          cssClasses={["nc-card-subtitle"]}
          label={subtitle}
          maxWidthChars={13}
          halign={Gtk.Align.CENTER}
          $={(self: Gtk.Label) => self.set_ellipsize(3)}
        />
      </box>
    </button>
  )
}

// ─── Night Mode Card (wlsunset) ──────────────────────────────────────────────
function NightModeCard() {
  const [on, setOn] = createState(isWlsunsetRunning())

  // Poll to keep state in sync
  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 4000, () => {
    setOn(isWlsunsetRunning())
    return GLib.SOURCE_CONTINUE
  })

  return (
    <button
      cssClasses={on((o: boolean) =>
        o ? ["nc-sq-card", "active"] : ["nc-sq-card"],
      )}
      hexpand
      onClicked={() => {
        const isOn = isWlsunsetRunning()
        if (isOn) {
          GLib.spawn_command_line_async("pkill wlsunset")
          setOn(false)
          notify({
            appName: "Night Mode",
            summary: "Night Mode Off",
            body: "Color temperature restored",
            urgency: 0,
          })
        } else {
          // -t 3200 -T 3200 forces warm tone at all times
          GLib.spawn_command_line_async("wlsunset -t 3200 -T 3200")
          setOn(true)
          notify({
            appName: "Night Mode",
            summary: "Night Mode On",
            body: "Warm color temperature applied",
            urgency: 0,
          })
        }
      }}
    >
      <box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={4}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >
        <label cssClasses={["nc-card-icon"]} label="󰖔" />
        <label cssClasses={["nc-card-title"]} label="Night" />
        <label
          cssClasses={["nc-card-subtitle"]}
          label={on((o: boolean) => (o ? "On" : "Off"))}
        />
      </box>
    </button>
  )
}

// ─── Focus Card (DnD, renamed) ───────────────────────────────────────────────
function FocusCard() {
  const notifd = Notifd.get_default()
  const [dnd, setDnd] = createState(notifd.dont_disturb)

  notifd.connect("notify::dont-disturb", () => setDnd(notifd.dont_disturb))

  return (
    <button
      cssClasses={dnd((d: boolean) =>
        d ? ["nc-wide-card", "active"] : ["nc-wide-card"],
      )}
      hexpand
      onClicked={() => {
        const next = !notifd.dont_disturb
        notifd.dont_disturb = next
        setDnd(next)
        notify({
          appName: "Focus",
          summary: next ? "Focus On" : "Focus Off",
          body: next ? "Notifications silenced" : "Notifications enabled",
          urgency: 0,
        })
      }}
    >
      <box spacing={14} valign={Gtk.Align.CENTER} halign={Gtk.Align.START}>
        <label cssClasses={["nc-card-icon"]} label="󰖔" />
        <box orientation={Gtk.Orientation.VERTICAL} spacing={1}>
          <label
            cssClasses={["nc-card-title"]}
            label="Focus"
            halign={Gtk.Align.START}
          />
          <label
            cssClasses={["nc-card-subtitle"]}
            label={dnd((d: boolean) => (d ? "On" : "Off"))}
            halign={Gtk.Align.START}
          />
        </box>
      </box>
    </button>
  )
}

// ─── Calculator Button ────────────────────────────────────────────────────────
function CalcButton() {
  return (
    <button
      cssClasses={["nc-circle-btn"]}
      onClicked={() => GLib.spawn_command_line_async("gnome-calculator")}
    >
      <label
        cssClasses={["nc-card-icon"]}
        label="󰃬"
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      />
    </button>
  )
}

// ─── Sliders ──────────────────────────────────────────────────────────────────
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
      const cur = parseInt(
        new TextDecoder().decode(curOut as Uint8Array).trim(),
      )
      const max = parseInt(
        new TextDecoder().decode(maxOut as Uint8Array).trim(),
      )
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
    <box cssClasses={["nc-slider-row"]} spacing={12}>
      <label cssClasses={["nc-slider-icon"]} label={ico} />
      <slider
        cssClasses={["nc-thick-slider"]}
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
      <label
        cssClasses={["nc-slider-value"]}
        label={vol((v: number) => `${Math.round(v * 100)}%`)}
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
    <box cssClasses={["nc-slider-row"]} spacing={12}>
      <label cssClasses={["nc-slider-icon"]} label={ico} />
      <slider
        cssClasses={["nc-thick-slider"]}
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
      <label
        cssClasses={["nc-slider-value"]}
        label={brightness((b: number) => `${Math.round(b * 100)}%`)}
      />
    </box>
  )
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function Controls() {
  return (
    <box
      cssClasses={["nc-controls"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
    >
      {/* ── Row 1: left column (WiFi + BT/Night) │ right column (Media) ── */}
      <box spacing={8}>
        <box orientation={Gtk.Orientation.VERTICAL} spacing={8} hexpand>
          <WifiCard />
          <box spacing={8}>
            <BtCard />
            <NightModeCard />
          </box>
        </box>
        <MediaPlayerCard />
      </box>

      {/* ── Row 2: Focus pill + Calculator ── */}
      <box spacing={8}>
        <FocusCard />
        <CalcButton />
      </box>

      {/* ── Row 3: Sliders ── */}
      <box
        cssClasses={["nc-sliders-card"]}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={10}
      >
        <BrightnessSlider />
        <VolumeSlider />
      </box>
    </box>
  )
}
