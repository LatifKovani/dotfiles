import Bluetooth from "gi://AstalBluetooth"
import GLib from "gi://GLib"
import { createBinding } from "ags"

const watchedDevices = new Set<string>()

function watchDevice(device: Bluetooth.Device) {
  if (watchedDevices.has(device.address)) return
  watchedDevices.add(device.address)

  device.connect("notify::connected", () => {
    const name = device.name || "Unknown Device"
    if (device.connected) {
      GLib.spawn_command_line_async(
        `notify-send -u low -i bluetooth "Bluetooth Connected" "${name} connected"`,
      )
    } else {
      GLib.spawn_command_line_async(
        `notify-send -u low -i bluetooth "Bluetooth Disconnected" "${name} disconnected"`,
      )
    }
  })
}

export default function BluetoothWidget() {
  const bt = Bluetooth.get_default()

  for (const device of bt.devices) {
    watchDevice(device)
  }

  bt.connect(
    "device-added",
    (_: Bluetooth.Bluetooth, device: Bluetooth.Device) => {
      watchDevice(device)
    },
  )

  if (!bt.adapter) {
    return (
      <button
        cssClasses={["bt-btn"]}
        onClicked={() => GLib.spawn_command_line_async("overskride")}
        label="󰂯"
      />
    )
  }

  const powered = createBinding(bt.adapter, "powered")

  function toggleBluetooth() {
    const adapter = bt.adapter!
    const next = !adapter.powered
    adapter.powered = next

    if (next) {
      GLib.spawn_command_line_async(
        `notify-send -u low -i bluetooth "Bluetooth On" "Bluetooth has been enabled"`,
      )
    } else {
      GLib.spawn_command_line_async(
        `notify-send -u low -i bluetooth "Bluetooth Off" "Bluetooth has been disabled"`,
      )
    }
  }

  return (
    <box cssClasses={["bt-wrapper"]}>
      <button
        cssClasses={powered((p) => (p ? ["bt-btn", "active"] : ["bt-btn"]))}
        label=" "
        onClicked={toggleBluetooth}
      />
    </box>
  )
}

// label=" "
