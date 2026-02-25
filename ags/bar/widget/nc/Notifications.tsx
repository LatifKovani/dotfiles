import { createState } from "ags"
import { Gtk } from "ags/gtk4"

interface Notification {
  id: number
  appName: string
  summary: string
  body: string
  time: number
  dismiss: () => void
}

function timeAgo(time: number): string {
  const diff = Math.floor(Date.now() / 1000) - time
  if (diff < 60) return "now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function NotifCard({ notif }: { notif: Notification }) {
  return (
    <box cssClasses={["nc-notif"]} spacing={10}>
      <box cssClasses={["nc-notif-icon-box"]} valign={Gtk.Align.START}>
        <label cssClasses={["nc-notif-icon-fallback"]} label="󰍡" />
      </box>
      <box orientation={Gtk.Orientation.VERTICAL} hexpand spacing={2}>
        <box>
          <label
            cssClasses={["nc-notif-app"]}
            label={notif.appName || "Unknown"}
            halign={Gtk.Align.START}
            hexpand
            xalign={0}
          />
          <label
            cssClasses={["nc-notif-time"]}
            label={timeAgo(notif.time)}
            halign={Gtk.Align.END}
          />
        </box>
        {notif.summary ? (
          <label
            cssClasses={["nc-notif-summary"]}
            label={notif.summary}
            halign={Gtk.Align.START}
            xalign={0}
            wrap
            maxWidthChars={36}
          />
        ) : null}
        {notif.body ? (
          <label
            cssClasses={["nc-notif-body"]}
            label={notif.body}
            halign={Gtk.Align.START}
            xalign={0}
            wrap
            maxWidthChars={36}
          />
        ) : null}
      </box>
      <button
        cssClasses={["nc-notif-close"]}
        label="󰅖"
        valign={Gtk.Align.START}
        onClicked={() => notif.dismiss()}
      />
    </box>
  )
}

function EmptyNotif() {
  return (
    <box
      cssClasses={["nc-notif-empty"]}
      orientation={Gtk.Orientation.VERTICAL}
      halign={Gtk.Align.CENTER}
      spacing={8}
    >
      <label cssClasses={["nc-notif-empty-icon"]} label="󰂚" />
      <label cssClasses={["nc-notif-empty-label"]} label="No notifications" />
    </box>
  )
}

function NotifList({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) return <EmptyNotif />
  return (
    <box orientation={Gtk.Orientation.VERTICAL} spacing={6}>
      {notifications.map((n) => (
        <NotifCard notif={n} />
      ))}
    </box>
  )
}

export default function Notifications() {
  const [notifications, setNotifications] = createState<Notification[]>([])

  try {
    const Notifd = (globalThis as any).imports?.gi?.AstalNotifd
    if (Notifd) {
      const notifd = Notifd.get_default()
      setNotifications([...notifd.notifications])
      notifd.connect("notify::notifications", () => {
        setNotifications([...notifd.notifications])
      })
    }
  } catch (_) { }

  return (
    <box
      cssClasses={["nc-notifications"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={6}
    >
      <box cssClasses={["nc-notif-header"]}>
        <label
          cssClasses={["nc-notif-title"]}
          label="Notifications"
          hexpand
          halign={Gtk.Align.START}
        />
        <button
          cssClasses={["nc-notif-clear-btn"]}
          label="Clear All"
          onClicked={() => {
            const ns = notifications(
              (n: Notification[]) => n,
            ) as unknown as Notification[]
            for (const n of ns) n.dismiss()
          }}
        />
      </box>
      <scrolledwindow
        cssClasses={["nc-notif-scroll"]}
        vexpand
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
        heightRequest={200}
      >
        <NotifList
          notifications={
            notifications((n: Notification[]) => n) as unknown as Notification[]
          }
        />
      </scrolledwindow>
    </box>
  )
}
