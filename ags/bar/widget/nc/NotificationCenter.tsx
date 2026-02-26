import { Astal, Gtk } from "ags/gtk4"
import { createState } from "ags"
import { createPoll } from "ags/time"
import Toggles from "./Toggles"
import Sliders from "./Sliders"
import Notifications from "./Notifications"

export const [ncVisible, setNcVisible] = createState(false)

let _ncVisible = false
export function toggleNc() {
  _ncVisible = !_ncVisible
  setNcVisible(_ncVisible)
}

function Header() {
  const time = createPoll("", 1000, "date '+%H:%M'")
  const date = createPoll("", 60000, "date '+%A, %B %d'")

  return (
    <box cssClasses={["nc-header"]} spacing={8}>
      <box
        orientation={Gtk.Orientation.VERTICAL}
        hexpand
        halign={Gtk.Align.START}
      >
        <label
          cssClasses={["nc-header-time"]}
          label={time}
          halign={Gtk.Align.START}
        />
        <label
          cssClasses={["nc-header-date"]}
          label={date}
          halign={Gtk.Align.START}
        />
      </box>
    </box>
  )
}

function Divider() {
  return <box cssClasses={["nc-divider"]} heightRequest={1} />
}

export default function NotificationCenter() {
  const { TOP, RIGHT } = Astal.WindowAnchor

  return (
    <window
      cssClasses={["nc-window"]}
      layer={Astal.Layer.OVERLAY}
      anchor={TOP | RIGHT}
      marginTop={4}
      marginRight={0}
      visible={ncVisible}
      keymode={Astal.Keymode.ON_DEMAND}
    >
      <box
        cssClasses={ncVisible((v: boolean) =>
          v ? ["nc-panel", "visible"] : ["nc-panel"],
        )}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={14}
        widthRequest={340}
      >
        <Header />
        <Divider />
        <Toggles />
        <Divider />
        <Sliders />
        <Divider />
        <Notifications />
      </box>
    </window>
  )
}
