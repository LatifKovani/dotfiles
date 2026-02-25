import Network from "gi://AstalNetwork"
import Bluetooth from "gi://AstalBluetooth"
import GLib from "gi://GLib"
import { Gtk } from "ags/gtk4"
import { createBinding, createState } from "ags"

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
  const wifi = network.wifi

  const [dnd, setDnd] = createState(false)
  const wifiEnabled = wifi ? createBinding(wifi, "enabled") : null
  const btPowered = bt.adapter ? createBinding(bt.adapter, "powered") : null

  return (
    <box cssClasses={["nc-toggles-grid"]} spacing={8}>
      {wifi && wifiEnabled && (
        <Toggle
          icon="󰖩"
          label="Wi-Fi"
          active={wifiEnabled((e: boolean) => e) as unknown as boolean}
          onToggle={() => {
            wifi.enabled = !wifi.enabled
          }}
        />
      )}
      {bt.adapter && btPowered && (
        <Toggle
          icon="󰂯"
          label="Bluetooth"
          active={btPowered((p: boolean) => p) as unknown as boolean}
          onToggle={() => {
            bt.adapter!.powered = !bt.adapter!.powered
          }}
        />
      )}
      <Toggle
        icon={dnd((d: boolean) => (d ? "󰂛" : "󰂚")) as unknown as string}
        label="DnD"
        active={dnd((d: boolean) => d) as unknown as boolean}
        onToggle={() => {
          const current = dnd((d: boolean) => d) as unknown as boolean
          const next = !current
          setDnd(next)
          GLib.spawn_command_line_async(
            `swaync-client --${next ? "dnd-on" : "dnd-off"}`,
          )
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
