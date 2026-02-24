import Bluetooth from "gi://AstalBluetooth"
import GLib from "gi://GLib"
import { createBinding } from "ags"

export default function BluetoothWidget() {
  const bt = Bluetooth.get_default()

  if (!bt.adapter) {
    return (
      <button
        cssClasses={["bt-btn"]}
        onClicked={() => GLib.spawn_command_line_async("blueman-manager")}
        label=" "
      />
    )
  }

  const powered = createBinding(bt.adapter, "powered")

  return (
    <button
      cssClasses={powered((p) => (p ? ["bt-btn", "active"] : ["bt-btn"]))}
      onClicked={() => GLib.spawn_command_line_async("blueman-manager")}
      label=" "
    />
  )
}
