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
  const [ssid, setSsid] = createState(wifi?.ssid ?? "Wi-Fi")
  const [btOn, setBtOn] = createState(bt.adapter?.powered ?? false)
  const [dnd, setDnd] = createState(notifd.dont_disturb)

  if (wifi) {
    wifi.connect("notify::enabled", () => setWifiOn(wifi.enabled))
    wifi.connect("notify::ssid", () => setSsid(wifi.ssid ?? "Wi-Fi"))
  }
  if (bt.adapter)
    bt.adapter.connect("notify::powered", () => setBtOn(bt.adapter!.powered))
  notifd.connect("notify::dont-disturb", () => setDnd(notifd.dont_disturb))

  return (
    <box
      cssClasses={["nc-toggles-grid"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
    >
      {/* Top row: WiFi large + small toggles column */}
      <box spacing={8} homogeneous>
        {/* WiFi large card */}
        {wifi && (
          <button
            cssClasses={wifiOn((w: boolean) =>
              w ? ["nc-toggle-large", "active"] : ["nc-toggle-large"],
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
              spacing={6}
              halign={Gtk.Align.START}
              valign={Gtk.Align.CENTER}
              hexpand
            >
              <label
                cssClasses={["nc-toggle-icon-large"]}
                label={wifiOn((w: boolean) => (w ? "󰖩" : "󰖪"))}
                halign={Gtk.Align.START}
              />
              <box orientation={Gtk.Orientation.VERTICAL} spacing={1}>
                <label
                  cssClasses={["nc-toggle-title"]}
                  label="Wi-Fi"
                  halign={Gtk.Align.START}
                />
                <label
                  cssClasses={["nc-toggle-subtitle"]}
                  label={ssid}
                  halign={Gtk.Align.START}
                  ellipsize={3}
                  maxWidthChars={14}
                />
              </box>
            </box>
          </button>
        )}

        {/* Bluetooth large card */}
        {bt.adapter && (
          <button
            cssClasses={btOn((b: boolean) =>
              b ? ["nc-toggle-large", "active"] : ["nc-toggle-large"],
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
              spacing={6}
              halign={Gtk.Align.START}
              valign={Gtk.Align.CENTER}
              hexpand
            >
              <label
                cssClasses={["nc-toggle-icon-large"]}
                label={btOn((b: boolean) => (b ? "󰂯" : "󰂲"))}
                halign={Gtk.Align.START}
              />
              <box orientation={Gtk.Orientation.VERTICAL} spacing={1}>
                <label
                  cssClasses={["nc-toggle-title"]}
                  label="Bluetooth"
                  halign={Gtk.Align.START}
                />
                <label
                  cssClasses={["nc-toggle-subtitle"]}
                  label={btOn((b: boolean) => (b ? "On" : "Off"))}
                  halign={Gtk.Align.START}
                />
              </box>
            </box>
          </button>
        )}
      </box>

      {/* Bottom row: Focus + Look small toggles */}
      <box spacing={8} homogeneous>
        <button
          cssClasses={dnd((d: boolean) =>
            d ? ["nc-toggle-large", "active"] : ["nc-toggle-large"],
          )}
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
          <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={6}
            halign={Gtk.Align.START}
            valign={Gtk.Align.CENTER}
            hexpand
          >
            <label
              cssClasses={["nc-toggle-icon-large"]}
              label=""
              halign={Gtk.Align.START}
            />
            <box orientation={Gtk.Orientation.VERTICAL} spacing={1}>
              <label
                cssClasses={["nc-toggle-title"]}
                label="Focus"
                halign={Gtk.Align.START}
              />
              <label
                cssClasses={["nc-toggle-subtitle"]}
                label={dnd((d: boolean) => (d ? "On" : "Off"))}
                halign={Gtk.Align.START}
              />
            </box>
          </box>
        </button>

        <button
          cssClasses={["nc-toggle-large"]}
          onClicked={() => GLib.spawn_command_line_async("nwg-look")}
        >
          <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={6}
            halign={Gtk.Align.START}
            valign={Gtk.Align.CENTER}
            hexpand
          >
            <label
              cssClasses={["nc-toggle-icon-large"]}
              label="󰏘"
              halign={Gtk.Align.START}
            />
            <box orientation={Gtk.Orientation.VERTICAL} spacing={1}>
              <label
                cssClasses={["nc-toggle-title"]}
                label="Look"
                halign={Gtk.Align.START}
              />
              <label
                cssClasses={["nc-toggle-subtitle"]}
                label="Appearance"
                halign={Gtk.Align.START}
              />
            </box>
          </box>
        </button>
      </box>
    </box>
  )
}
