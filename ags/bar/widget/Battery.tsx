import Battery from "gi://AstalBattery"
import { createBinding } from "ags"

function batteryIcon(p: number): string {
  if (p > 0.9) return " "
  if (p > 0.7) return " "
  if (p > 0.5) return " "
  if (p > 0.3) return " "
  if (p > 0.1) return " "
  return " "
}

export default function BatteryWidget() {
  const bat = Battery.get_default()
  const percent = createBinding(bat, "percentage")

  return (
    <box cssClasses={["battery"]} spacing={4}>
      <label
        cssClasses={["battery-icon"]}
        label={percent((p) => batteryIcon(p))}
      />
      <label
        cssClasses={["battery-label"]}
        label={percent((p) => `${Math.round(p * 100)}%`)}
      />
    </box>
  )
}
