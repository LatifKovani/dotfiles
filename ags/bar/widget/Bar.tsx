import { Astal, Gtk } from "ags/gtk4"
import Clock from "./bar/Clock"
import Workspaces from "./bar/Workspaces"
import Battery from "./bar/Battery"
import Wifi from "./bar/Wireless"
import Ram from "./bar/Ram"
import Cpu from "./bar/Cpu"
import Bluetooth from "./bar/Bluetooth"
import { setNcVisible, ncVisible } from "./nc/NotificationCenter"
import { createState } from "ags"

function Sep() {
  return <box cssClasses={["bar-sep"]} widthRequest={1} />
}

function NcButton() {
  const [count, setCount] = createState(0)
  const [hasNotifs, setHasNotifs] = createState(false)

  try {
    const Notifd = (globalThis as any).imports?.gi?.AstalNotifd
    if (Notifd) {
      const notifd = Notifd.get_default()
      setCount(notifd.notifications.length)
      setHasNotifs(notifd.notifications.length > 0)
      notifd.connect("notify::notifications", () => {
        const len = notifd.notifications.length
        setCount(len)
        setHasNotifs(len > 0)
      })
    }
  } catch (_) { }

  function toggle() {
    setNcVisible(!ncVisible.get())
  }

  return (
    <button
      cssClasses={ncVisible((v: boolean) =>
        v ? ["nc-bar-btn", "active"] : ["nc-bar-btn"],
      )}
      onClicked={toggle}
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
