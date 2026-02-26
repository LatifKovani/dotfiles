import { Astal, Gtk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import GLib from "gi://GLib"

function makeToast(n: any): Gtk.Widget {
  const appName = String(n.app_name || "Unknown")
  const summary = String(n.summary || "")
  const body = String(n.body || "")

  const appLabel = new Gtk.Label({
    label: appName,
    halign: Gtk.Align.START,
    hexpand: true,
    xalign: 0,
  })
  appLabel.add_css_class("nc-notif-app")

  const closeBtn = new Gtk.Button({ label: "󰅖", valign: Gtk.Align.START })
  closeBtn.add_css_class("nc-notif-close")

  const topRow = new Gtk.Box({ spacing: 4 })
  topRow.append(appLabel)
  topRow.append(closeBtn)

  const inner = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    hexpand: true,
    spacing: 3,
  })
  inner.append(topRow)

  if (summary) {
    const s = new Gtk.Label({
      label: summary,
      halign: Gtk.Align.START,
      xalign: 0,
      wrap: true,
      max_width_chars: 34,
    })
    s.add_css_class("nc-notif-summary")
    inner.append(s)
  }

  if (body) {
    const b = new Gtk.Label({
      label: body,
      halign: Gtk.Align.START,
      xalign: 0,
      wrap: true,
      max_width_chars: 34,
    })
    b.add_css_class("nc-notif-body")
    inner.append(b)
  }

  const iconLabel = new Gtk.Label({ label: "󰍡", valign: Gtk.Align.START })
  iconLabel.add_css_class("nc-notif-icon-fallback")

  const row = new Gtk.Box({ spacing: 10 })
  row.add_css_class("toast-card")
  row.append(iconLabel)
  row.append(inner)

  closeBtn.connect("clicked", () => {
    n.dismiss()
  })

  return row
}

export default function NotificationPopups() {
  const { TOP, RIGHT } = Astal.WindowAnchor
  const notifd = Notifd.get_default()

  const toasts = new Map<number, { widget: Gtk.Widget; timeout: number }>()

  const toastBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 8,
  })
  toastBox.add_css_class("toast-list")

  const win = (
    <window
      cssClasses={["toast-window"]}
      layer={Astal.Layer.OVERLAY}
      anchor={TOP | RIGHT}
      marginTop={48}
      marginRight={12}
      visible={false}
      keymode={Astal.Keymode.NONE}
    >
      {toastBox}
    </window>
  ) as any

  const dismissToast = (id: number) => {
    const entry = toasts.get(id)
    if (!entry) return
    if (entry.timeout) GLib.source_remove(entry.timeout)
    toastBox.remove(entry.widget)
    toasts.delete(id)
    if (toasts.size === 0) win.visible = false
  }

  const showToast = (id: number) => {
    if (toasts.has(id)) return
    const n = notifd.get_notification(id)
    if (!n) return

    const card = makeToast(n)
    toastBox.append(card)

    // Wire up close button dismiss
    const closeBtn = card.get_first_child()
    if (closeBtn) {
      // close is already wired in makeToast via n.dismiss()
      // also hide from toasts map when dismissed
    }

    const timeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 5000, () => {
      dismissToast(id)
      return GLib.SOURCE_REMOVE
    })

    toasts.set(id, { widget: card, timeout })
    win.visible = true
  }

  notifd.connect("notified", (_: any, id: number) => showToast(id))
  notifd.connect("resolved", (_: any, id: number) => dismissToast(id))

  return win
}
