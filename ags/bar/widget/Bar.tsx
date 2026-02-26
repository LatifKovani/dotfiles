import { Astal, Gtk } from "ags/gtk4"
import Clock from "./bar/Clock"
import Workspaces from "./bar/Workspaces"
import Battery from "./bar/Battery"
import Wifi from "./bar/Wireless"
import Ram from "./bar/Ram"
import Cpu from "./bar/Cpu"
import Bluetooth from "./bar/Bluetooth"
import { toggleNc, ncVisible } from "./nc/NotificationCenter"
import { createState } from "ags"
import Notifd from "gi://AstalNotifd"

function Sep() {
  return <box cssClasses={["bar-sep"]} widthRequest={1} />
}

function NcButton() {
  const notifd = Notifd.get_default()
  const [count, setCount] = createState(notifd.get_notifications().length)
  const [hasNotifs, setHasNotifs] = createState(
    notifd.get_notifications().length > 0,
  )

  const update = () => {
    const len = notifd.get_notifications().length
    setCount(len)
    setHasNotifs(len > 0)
  }

  notifd.connect("notified", update)
  notifd.connect("resolved", update)

  return (
    <button
      cssClasses={ncVisible((v: boolean) =>
        v ? ["nc-bar-btn", "active"] : ["nc-bar-btn"],
      )}
      onClicked={toggleNc}
    >
      <box spacing={4}>
        <label
          cssClasses={["nc-bar-icon"]}
          label={hasNotifs((h: boolean) => (h ? "󰂚" : "󰂜"))}
        />
        <label
          cssClasses={["nc-bar-count"]}
          label={count((c: number) => (c > 0 ? String(c) : ""))}
          visible={hasNotifs}
        />
      </box>
    </button>
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
        <Sep />
        <Workspaces />
        <Sep />
        <Cpu />
        <Ram />
        <Sep />
        <Bluetooth />
        <Wifi />
        <Battery />
        <Sep />
        <NcButton />
      </box>
    </window>
  )
}
