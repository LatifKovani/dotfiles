import { createPoll } from "ags/time"

export default function Ram() {
  const ram = createPoll(
    "",
    2000,
    `awk '/MemTotal/{t=$2} /MemAvailable/{a=$2} END{printf "%.1f", (t-a)/1024/1024}' /proc/meminfo`,
  )

  return (
    <box cssClasses={["ram"]} spacing={4}>
      <label cssClasses={["ram-icon"]} label="󰍛" />
      <label cssClasses={["ram-label"]} label={ram((r) => `${r} GB`)} />
    </box>
  )
}
