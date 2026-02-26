import Network from "gi://AstalNetwork"
import Bluetooth from "gi://AstalBluetooth"
import Notifd from "gi://AstalNotifd"
import GLib from "gi://GLib"
import { Gtk } from "ags/gtk4"
import { createState } from "ags"
import { notify } from "../notify"

function Toggle({
  icon,
  label,
  active,
  onToggle,
}: {
  icon: string
  label: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      cssClasses={active ? ["nc-toggle", "active"] : ["nc-toggle"]}
      onClicked={onToggle}
    >
      <box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={4}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >
        <label cssClasses={["nc-toggle-icon"]} label={icon} />
        <label cssClasses={["nc-toggle-label"]} label={label} />
      </box>
    </button>
  )
}

export default function Toggles() {
  const network = Network.get_default()
  const bt = Bluetooth.get_default()
  const notifd = Notifd.get_default()
  const wifi = network.wifi

  const [wifiOn, setWifiOn] = createState(wifi?.enabled ?? false)
  const [btOn, setBtOn] = createState(bt.adapter?.powered ?? false)
  const [dnd, setDnd] = createState(notifd.dont_disturb)

  if (wifi) wifi.connect("notify::enabled", () => setWifiOn(wifi.enabled))
  if (bt.adapter)
    bt.adapter.connect("notify::powered", () => setBtOn(bt.adapter!.powered))

  notifd.connect("notify::dont-disturb", () => setDnd(notifd.dont_disturb))

  return (
    <box cssClasses={["nc-toggles-grid"]} spacing={8}>
      {wifi && (
        <Toggle
          icon={wifiOn((w: boolean) => (w ? "󰖩" : "󰖪")) as unknown as string}
          label="Wi-Fi"
          active={wifiOn((w: boolean) => w) as unknown as boolean}
          onToggle={() => {
            // Update UI immediately, do the actual toggle async
            const next = !wifi.enabled
            GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
              wifi.enabled = next
              notify({
                appName: "Wi-Fi",
                summary: next ? "Wi-Fi On" : "Wi-Fi Off",
                body: next ? "Wireless enabled" : "Wireless disabled",
                urgency: 0,
              })
              return GLib.SOURCE_REMOVE
            })
          }}
        />
      )}

      {bt.adapter && (
        <Toggle
          icon={btOn((b: boolean) => (b ? "󰂯" : "󰂲")) as unknown as string}
          label="Bluetooth"
          active={btOn((b: boolean) => b) as unknown as boolean}
          onToggle={() => {
            const next = !bt.adapter!.powered
            // Update UI instantly without waiting for BlueZ to confirm
            setBtOn(next)
            bt.adapter!.powered = next
            notify({
              appName: "Bluetooth",
              summary: next ? "Bluetooth On" : "Bluetooth Off",
              body: next ? "Bluetooth enabled" : "Bluetooth disabled",
              urgency: 0,
            })
          }}
        />
      )}

      <Toggle
        icon={dnd((d: boolean) => (d ? "󰂛" : "󰂚")) as unknown as string}
        label="DnD"
        active={dnd((d: boolean) => d) as unknown as boolean}
        onToggle={() => {
          // DnD is instant, no blocking
          const next = !notifd.dont_disturb
          notifd.dont_disturb = next
          notify({
            appName: "Do Not Disturb",
            summary: next ? "Do Not Disturb On" : "Do Not Disturb Off",
            body: next ? "Notifications silenced" : "Notifications enabled",
            urgency: 0,
          })
        }}
      />

      <Toggle
        icon="󰏘"
        label="Look"
        active={false}
        onToggle={() => GLib.spawn_command_line_async("nwg-look")}
      />
    </box>
  )
}
