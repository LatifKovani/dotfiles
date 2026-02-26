import Network from "gi://AstalNetwork"
import Bluetooth from "gi://AstalBluetooth"
import Notifd from "gi://AstalNotifd"
import GLib from "gi://GLib"
import { Gtk } from "ags/gtk4"
import { createState } from "ags"
import { notify } from "../notify"

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
        <button
          cssClasses={wifiOn((w: boolean) =>
            w ? ["nc-toggle", "active"] : ["nc-toggle"],
          )}
          onClicked={() => {
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
        >
          <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={4}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
          >
            <label
              cssClasses={["nc-toggle-icon"]}
              label={wifiOn((w: boolean) => (w ? "󰖩" : "󰖪"))}
            />
            <label cssClasses={["nc-toggle-label"]} label="Wi-Fi" />
          </box>
        </button>
      )}

      {bt.adapter && (
        <button
          cssClasses={btOn((b: boolean) =>
            b ? ["nc-toggle", "active"] : ["nc-toggle"],
          )}
          onClicked={() => {
            const next = !bt.adapter!.powered
            setBtOn(next)
            bt.adapter!.powered = next
            notify({
              appName: "Bluetooth",
              summary: next ? "Bluetooth On" : "Bluetooth Off",
              body: next ? "Bluetooth enabled" : "Bluetooth disabled",
              urgency: 0,
            })
          }}
        >
          <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={4}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
          >
            <label
              cssClasses={["nc-toggle-icon"]}
              label={btOn((b: boolean) => (b ? "󰂯" : "󰂲"))}
            />
            <label cssClasses={["nc-toggle-label"]} label="Bluetooth" />
          </box>
        </button>
      )}

      {/* DnD: active = dont_disturb is ON = notifications silenced */}
      {/* icon 󰂛 = silenced (dnd ON), icon 󰂚 = bell (dnd OFF) */}
      <button
        cssClasses={dnd((d: boolean) =>
          d ? ["nc-toggle", "active"] : ["nc-toggle"],
        )}
        onClicked={() => {
          const next = !notifd.dont_disturb
          notifd.dont_disturb = next
          setDnd(next)
          notify({
            appName: "Do Not Disturb",
            summary: next ? "Do Not Disturb On" : "Do Not Disturb Off",
            body: next ? "Notifications silenced" : "Notifications enabled",
            urgency: 0,
          })
        }}
      >
        <box
          orientation={Gtk.Orientation.VERTICAL}
          spacing={4}
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
        >
          <label
            cssClasses={["nc-toggle-icon"]}
            label={dnd((d: boolean) => (d ? "󰂛" : "󰂚"))}
          />
          <label cssClasses={["nc-toggle-label"]} label="DnD" />
        </box>
      </button>

      <button
        cssClasses={["nc-toggle"]}
        onClicked={() => GLib.spawn_command_line_async("nwg-look")}
      >
        <box
          orientation={Gtk.Orientation.VERTICAL}
          spacing={4}
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
        >
          <label cssClasses={["nc-toggle-icon"]} label="󰏘" />
          <label cssClasses={["nc-toggle-label"]} label="Look" />
        </box>
      </button>
    </box>
  )
}
