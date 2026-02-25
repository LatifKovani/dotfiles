import { Astal, Gtk } from "ags/gtk4"
import { createState } from "ags"
import { createPoll } from "ags/time"
import Toggles from "./Toggles"
import Sliders from "./Sliders"
import MediaPlayer from "./MediaPlayer"
import Notifications from "./Notifications"

export const [ncVisible, setNcVisible] = createState(false)

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
      marginTop={10}
      marginRight={8}
      visible={ncVisible}
      keymode={Astal.Keymode.ON_DEMAND}
    >
      <revealer
        revealChild={ncVisible}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        transitionDuration={250}
      >
        <box
          cssClasses={["nc-panel"]}
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
          <MediaPlayer />
          <Divider />
          <Notifications />
        </box>
      </revealer>
    </window>
  )
}
