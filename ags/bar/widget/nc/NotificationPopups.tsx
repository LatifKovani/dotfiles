import { Astal, Gtk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import GLib from "gi://GLib"

function getIcon(appName: string, summary: string): string {
  const app = (appName + " " + summary).toLowerCase()
  if (app.includes("battery") || app.includes("charg")) return "󰂄"
  if (app.includes("bluetooth")) return "󰂯"
  if (app.includes("wifi") || app.includes("wi-fi") || app.includes("wireless"))
    return "󰖩"
  if (app.includes("volume") || app.includes("audio") || app.includes("sound"))
    return "󰕾"
  if (app.includes("brightness")) return "󰃠"
  if (app.includes("screenshot")) return "󰹄"
  if (app.includes("mail") || app.includes("email")) return "󰇮"
  if (
    app.includes("discord") ||
    app.includes("message") ||
    app.includes("chat")
  )
    return "󰍦"
  if (app.includes("spotify") || app.includes("music")) return "󰎇"
  if (app.includes("error") || app.includes("fail") || app.includes("critical"))
    return "󰅙"
  if (app.includes("warning") || app.includes("warn")) return "󰀦"
  if (app.includes("do not disturb") || app.includes("dnd")) return "󰂛"
  return "󰍡"
}

// Same structure as NotificationCenter:
// <window> → <box.toast-card> directly, no intermediate containers
function ToastWindow({ n, onDismiss }: { n: any; onDismiss: () => void }) {
  const { TOP, RIGHT } = Astal.WindowAnchor
  const appName = String(n.app_name || "")
  const summary = String(n.summary || "")
  const body = String(n.body || "")
  const icon = getIcon(appName, summary)

  return (
    <window
      cssClasses={["toast-window"]}
      layer={Astal.Layer.OVERLAY}
      anchor={TOP | RIGHT}
      marginTop={52}
      marginRight={12}
      visible={true}
      keymode={Astal.Keymode.NONE}
    >
      <box cssClasses={["toast-card"]} spacing={10}>
        <label
          cssClasses={["toast-icon"]}
          label={icon}
          valign={Gtk.Align.START}
        />
        <box orientation={Gtk.Orientation.VERTICAL} hexpand spacing={3}>
          <box spacing={4}>
            <label
              cssClasses={["toast-app"]}
              label={appName || "Notification"}
              halign={Gtk.Align.START}
              hexpand
              xalign={0}
            />
            <button
              cssClasses={["nc-notif-close"]}
              label="󰅖"
              valign={Gtk.Align.START}
              onClicked={() => {
                n.dismiss()
                onDismiss()
              }}
            />
          </box>
          {summary ? (
            <label
              cssClasses={["toast-summary"]}
              label={summary}
              halign={Gtk.Align.START}
              xalign={0}
              wrap
              maxWidthChars={34}
            />
          ) : null}
          {body ? (
            <label
              cssClasses={["toast-body"]}
              label={body}
              halign={Gtk.Align.START}
              xalign={0}
              wrap
              maxWidthChars={34}
            />
          ) : null}
        </box>
      </box>
    </window>
  )
}

export default function NotificationPopups() {
  const notifd = Notifd.get_default()
  const toasts = new Map<number, { win: any; timeout: number }>()

  const dismissToast = (id: number) => {
    const entry = toasts.get(id)
    if (!entry) return
    if (entry.timeout) GLib.source_remove(entry.timeout)
    entry.win.visible = false
    entry.win.destroy()
    toasts.delete(id)
  }

  const showToast = (id: number) => {
    if (toasts.has(id)) return
    const n = notifd.get_notification(id)
    if (!n) return

    const win = (
      <ToastWindow n={n} onDismiss={() => dismissToast(id)} />
    ) as any

    const timeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 5000, () => {
      dismissToast(id)
      return GLib.SOURCE_REMOVE
    })

    toasts.set(id, { win, timeout })
  }

  notifd.connect("notified", (_: any, id: number) => showToast(id))
  notifd.connect("resolved", (_: any, id: number) => dismissToast(id))

  return <box visible={false} />
}
