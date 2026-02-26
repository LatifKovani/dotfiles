import Battery from "gi://AstalBattery"
import { createBinding, createState } from "ags"
import { notify } from "../notify"

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
      summary: "Critical Battery",
      body: "5% remaining! Plug in now.",
      urgency: 2 as const,
    },
    {
      level: 0.1,
      summary: "Very Low Battery",
      body: "10% remaining.",
      urgency: 2 as const,
    },
    {
      level: 0.15,
      summary: "Low Battery",
      body: "15% remaining.",
      urgency: 1 as const,
    },
    {
      level: 0.25,
      summary: "Low Battery",
      body: "25% remaining.",
      urgency: 1 as const,
    },
  ]
  for (const t of thresholds) {
    if (percent <= t.level && !notified.has(t.level * 100)) {
      notified.add(t.level * 100)
      notify({
        appName: "Battery",
        summary: t.summary,
        body: t.body,
        urgency: t.urgency,
      })
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
    const pct = Math.round(bat.percentage * 100)
    if (bat.charging) {
      notify({
        appName: "Battery",
        summary: "Charger Connected",
        body: `Charging at ${pct}%`,
        urgency: 0,
      })
    } else {
      notify({
        appName: "Battery",
        summary: "Charger Disconnected",
        body: `Battery at ${pct}%`,
        urgency: 0,
      })
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
