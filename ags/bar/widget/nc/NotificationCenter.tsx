import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createState } from "ags"
import { createPoll } from "ags/time"
import Controls from "./Controls"
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
  const { TOP } = Astal.WindowAnchor

  return (
    <window
      cssClasses={["nc-window"]}
      namespace="notification-center"
      layer={Astal.Layer.OVERLAY}
      anchor={TOP}
      marginTop={0}
      visible={ncVisible}
      keymode={Astal.Keymode.ON_DEMAND}
      $={(self: Astal.Window) => {
        const controller = new Gtk.EventControllerKey()
        controller.connect(
          "key-pressed",
          (_ctrl: Gtk.EventControllerKey, keyval: number) => {
            if (keyval === Gdk.KEY_Escape) {
              _ncVisible = false
              setNcVisible(false)
              return true
            }
            return false
          },
        )
        self.add_controller(controller)
      }}
    >
      <box
        cssClasses={ncVisible((v: boolean) =>
          v ? ["nc-panel", "visible"] : ["nc-panel"],
        )}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={14}
        widthRequest={660}
      >
        <Header />
        <Divider />
        <Controls />
        <Divider />
        <Notifications />
      </box>
    </window>
  )
}
