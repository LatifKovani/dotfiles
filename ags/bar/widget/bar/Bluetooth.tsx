import Bluetooth from "gi://AstalBluetooth"
import GLib from "gi://GLib"
import { createBinding } from "ags"
import { notify } from "../notify"

const watchedDevices = new Set<string>()

function watchDevice(device: Bluetooth.Device) {
  if (watchedDevices.has(device.address)) return
  watchedDevices.add(device.address)
  device.connect("notify::connected", () => {
    const name = device.name || "Unknown Device"
    if (device.connected) {
      notify({
        appName: "Bluetooth",
        summary: "Device Connected",
        body: `${name} connected`,
        urgency: 0,
      })
    } else {
      notify({
        appName: "Bluetooth",
        summary: "Device Disconnected",
        body: `${name} disconnected`,
        urgency: 0,
      })
    }
  })
}

export default function BluetoothWidget() {
  const bt = Bluetooth.get_default()

  for (const device of bt.devices) watchDevice(device)
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

  return (
    <box cssClasses={["bt-wrapper"]}>
      <button
        cssClasses={powered((p) => (p ? ["bt-btn", "active"] : ["bt-btn"]))}
        label=" "
        onClicked={() => GLib.spawn_command_line_async("overskride")}
      />
    </box>
  )
}

// label=" "
