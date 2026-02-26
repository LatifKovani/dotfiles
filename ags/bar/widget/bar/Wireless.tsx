import Network from "gi://AstalNetwork"
import GLib from "gi://GLib"
import { createBinding } from "ags"

function wifiIcon(strength: number): string {
  if (strength > 80) return "󰖩 "
  if (strength > 60) return "󰖩 "
  if (strength > 40) return "󱚶 "
  if (strength > 20) return "󱚵 "
  return "󰖪 "
}

export default function Wireless() {
  const network = Network.get_default()
  const wifi = network.wifi
  if (!wifi) return <label cssClasses={["wifi-btn"]} label="󰤮" />

  const strength = createBinding(wifi, "strength")
  const enabled = createBinding(wifi, "enabled")

  // Notify on connect/disconnect
  let lastSsid = wifi.ssid || ""
  wifi.connect("notify::ssid", () => {
    const ssid = wifi.ssid || ""
    if (ssid && ssid !== lastSsid) {
      GLib.spawn_command_line_async(
        `notify-send -u low "WiFi Connected" "Connected to ${ssid}"`,
      )
    } else if (!ssid && lastSsid) {
      GLib.spawn_command_line_async(
        `notify-send -u low "WiFi Disconnected" "Disconnected from ${lastSsid}"`,
      )
    }
    lastSsid = ssid
  })

  return (
    <button
      cssClasses={enabled((e) => (e ? ["wifi-btn", "active"] : ["wifi-btn"]))}
      onClicked={() => GLib.spawn_command_line_async("nm-connection-editor")}
      label={strength((s) => wifiIcon(s))}
    />
  )
}
