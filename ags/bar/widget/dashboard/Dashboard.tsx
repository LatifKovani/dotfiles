import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createState } from "ags"
import Calendar from "./Calendar"
import Pomodoro from "./Pomodoro"
import Todo from "./Todo"

let _open = false
export const [dashboardOpen, setDashboardOpen] = createState(false)

export function toggleDashboard() {
  _open = !_open
  setDashboardOpen(_open)
}

export default function Dashboard() {
  const { TOP } = Astal.WindowAnchor

  return (
    <window
      visible={dashboardOpen}
      name="dashboard"
      namespace="dashboard"
      cssClasses={["dashboard-window"]}
      anchor={TOP}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.ON_DEMAND}
      $={(self: Astal.Window) => {
        const controller = new Gtk.EventControllerKey()
        controller.connect(
          "key-pressed",
          (_ctrl: Gtk.EventControllerKey, keyval: number) => {
            if (keyval === Gdk.KEY_Escape) {
              _open = false
              setDashboardOpen(false)
              return true
            }
            return false
          },
        )
        self.add_controller(controller)
      }}
    >
      <box
        cssClasses={["dashboard"]}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={0}
        widthRequest={566}
      >
        <Calendar />
        <box cssClasses={["dash-divider"]} heightRequest={1} />
        <Pomodoro />
        <box cssClasses={["dash-divider"]} heightRequest={1} />
        <Todo />
      </box>
    </window>
  )
}
