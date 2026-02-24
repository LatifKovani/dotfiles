import { Astal, Gtk } from "ags/gtk4"
import { createPoll } from "ags/time"
import Clock from "./Clock"
import Workspaces from "./Workspaces"
import Battery from "./Battery"
import Wifi from "./Wireless"
import Ram from "./Ram"
import Cpu from "./Cpu"
import Media from "./Media"
import Bluetooth from "./Bluetooth"

function Sep() {
  return <box cssClasses={["bar-sep"]} widthRequest={1} />
}

function MediaSection() {
  const status = createPoll("", 2000, "playerctl status 2>/dev/null || echo ''")
  const visible = status((s) => s.trim() === "Playing")

  return (
    <box visible={visible} spacing={6}>
      <Sep />
      <Media />
    </box>
  )
}

export default function Bar(monitor: number) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      cssClasses={["bar"]}
      monitor={monitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      visible
    >
      <box halign={Gtk.Align.CENTER} cssClasses={["bar-center"]} spacing={6}>
        <Clock />
        <MediaSection />
        <Sep />
        <Workspaces />
        <Sep />
        <Cpu />
        <Ram />
        <Sep />
        <Bluetooth />
        <Wifi />
        <Battery />
      </box>
    </window>
  )
}
