import Battery from "gi://AstalBattery"
import { createBinding, createState } from "ags"
import GLib from "gi://GLib"

function batteryIcon(p: number, charging: boolean): string {
  if (charging) return "󰂄"
  if (p > 0.9) return " "
  if (p > 0.7) return " "
  if (p > 0.5) return " "
  if (p > 0.3) return " "
  if (p > 0.1) return " "
  return " "
}

const notified = new Set<number>()

function checkAndNotify(percent: number, charging: boolean) {
  if (charging) {
    notified.clear()
    return
  }

  const thresholds = [
    {
      level: 0.05,
      title: "Critical Battery",
      body: "5% remaining! Plug in now.",
      urgency: "critical",
    },
    {
      level: 0.1,
      title: "Very Low Battery",
      body: "10% remaining.",
      urgency: "critical",
    },
    {
      level: 0.15,
      title: "Low Battery",
      body: "15% remaining.",
      urgency: "normal",
    },
    {
      level: 0.25,
      title: "Low Battery",
      body: "25% remaining.",
      urgency: "normal",
    },
  ]

  for (const t of thresholds) {
    if (percent <= t.level && !notified.has(t.level)) {
      notified.add(t.level)
      GLib.spawn_command_line_async(
        `notify-send -u ${t.urgency} -i battery-low "${t.title}" "${t.body}"`,
      )
    }
  }
}

export default function BatteryWidget() {
  const bat = Battery.get_default()
  const percent = createBinding(bat, "percentage")

  const [icon, setIcon] = createState(batteryIcon(bat.percentage, bat.charging))

  bat.connect("notify::percentage", () => {
    setIcon(batteryIcon(bat.percentage, bat.charging))
    checkAndNotify(bat.percentage, bat.charging)
  })

  bat.connect("notify::charging", () => {
    setIcon(batteryIcon(bat.percentage, bat.charging))
    checkAndNotify(bat.percentage, bat.charging)

    if (bat.charging) {
      GLib.spawn_command_line_async(
        `notify-send -u low -i battery-caution "Charger Connected" "Battery is now charging at ${Math.round(bat.percentage * 100)}%"`,
      )
    } else {
      GLib.spawn_command_line_async(
        `notify-send -u low -i battery "Charger Disconnected" "Battery at ${Math.round(bat.percentage * 100)}%"`,
      )
    }
  })

  return (
    <box cssClasses={["battery"]} spacing={4}>
      <label cssClasses={["battery-icon"]} label={icon} />
      <label
        cssClasses={["battery-label"]}
        label={percent((p) => `${Math.round(p * 100)}%`)}
      />
    </box>
  )
}
// if (charging) return "󰂄"
// if (p > 0.9) return " "
// if (p > 0.7) return " "
// if (p > 0.5) return " "
// if (p > 0.3) return " "
// if (p > 0.1) return " "
// return " "
