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
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      cssClasses={["nc-window"]}
      namespace="notification-center"
      layer={Astal.Layer.OVERLAY}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={ncVisible}
      keymode={Astal.Keymode.ON_DEMAND}
      $={(self: Astal.Window) => {
        // Escape to close
        const keyCtrl = new Gtk.EventControllerKey()
        keyCtrl.connect(
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
        self.add_controller(keyCtrl)
      }}
    >
      {/* Full-screen overlay — clicking the empty area closes NC */}
      <box
        hexpand
        vexpand
        halign={Gtk.Align.FILL}
        valign={Gtk.Align.FILL}
        cssClasses={["nc-overlay"]}
        $={(self: Gtk.Box) => {
          const click = new Gtk.GestureClick()
          click.connect("released", () => {
            _ncVisible = false
            setNcVisible(false)
          })
          self.add_controller(click)
        }}
      >
        {/* Panel pinned to top-right, stops click propagation */}
        <box
          halign={Gtk.Align.END}
          valign={Gtk.Align.START}
          marginTop={31}
          marginEnd={677}
          $={(self: Gtk.Box) => {
            // Prevent clicks on the panel from reaching the overlay
            const click = new Gtk.GestureClick()
            click.connect("released", (_g: Gtk.GestureClick, _n: number) => {
              // do nothing — swallow the click
            })
            self.add_controller(click)
          }}
        >
          <box
            cssClasses={ncVisible((v: boolean) =>
              v ? ["nc-panel", "visible"] : ["nc-panel"],
            )}
            orientation={Gtk.Orientation.VERTICAL}
            spacing={14}
            widthRequest={566}
          >
            <Header />
            <Divider />
            <Controls />
            <Divider />
            <Notifications />
          </box>
        </box>
      </box>
    </window>
  )
}
