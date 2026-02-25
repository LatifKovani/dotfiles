import { createPoll } from "ags/time"

function tempIcon(t: number): string {
  if (t >= 90) return "\uf2c7"
  if (t >= 70) return "\uef2a"
  if (t >= 50) return "\uf2c9"
  if (t >= 30) return "\uf2ca"
  return "\uf2cb"
}

function tempClass(t: number): string[] {
  if (t >= 90) return ["cpu-temp-icon", "critical"]
  if (t >= 70) return ["cpu-temp-icon", "hot"]
  if (t >= 50) return ["cpu-temp-icon", "warm"]
  return ["cpu-temp-icon"]
}

function cpuClass(u: number): string[] {
  if (u >= 90) return ["cpu-icon", "critical"]
  if (u >= 70) return ["cpu-icon", "hot"]
  if (u >= 40) return ["cpu-icon", "warm"]
  if (u >= 20) return ["cpu-icon", "mild"]
  return ["cpu-icon"]
}

export default function Cpu() {
  const usage = createPoll(
    "0",
    2000,
    "bash -c \"top -bn1 | grep 'Cpu(s)' | awk '{print int($2)}'\"",
  )
  const temp = createPoll(
    "0",
    3000,
    "bash -c \"sensors | grep 'Package id 0' | awk '{gsub(/[^0-9.]/, \\\"\\\", $4); print int($4)}'\"",
  )

  return (
    <box cssClasses={["cpu"]} spacing={20}>
      <box spacing={4}>
        <label cssClasses={usage((u) => cpuClass(Number(u)))} label=" " />
        <label cssClasses={["cpu-label"]} label={usage((u) => `${u}%`)} />
      </box>
      <box spacing={4}>
        <label
          cssClasses={temp((t) => tempClass(Number(t)))}
          label={temp((t) => tempIcon(Number(t)))}
        />
        <label cssClasses={["cpu-temp-label"]} label={temp((t) => `${t}°C`)} />
      </box>
    </box>
  )
}
