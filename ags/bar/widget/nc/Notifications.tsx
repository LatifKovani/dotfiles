import { createState } from "ags"
import { Gtk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import GLib from "gi://GLib"

function timeAgo(time: number): string {
  const diff = Math.floor(Date.now() / 1000) - time
  if (diff < 60) return "now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function makeNotifCard(n: any): Gtk.Widget {
  const appName = String(n.app_name || "Unknown")
  const summary = String(n.summary || "")
  const body = String(n.body || "")
  const time = timeAgo(Number(n.time) || Math.floor(Date.now() / 1000))

  const appLabel = new Gtk.Label({
    label: appName,
    halign: Gtk.Align.START,
    hexpand: true,
    xalign: 0,
  })
  appLabel.add_css_class("nc-notif-app")

  const timeLabel = new Gtk.Label({ label: time, halign: Gtk.Align.END })
  timeLabel.add_css_class("nc-notif-time")

  const topRow = new Gtk.Box({ spacing: 4 })
  topRow.append(appLabel)
  topRow.append(timeLabel)

  const inner = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    hexpand: true,
    spacing: 2,
  })
  inner.append(topRow)

  if (summary) {
    const s = new Gtk.Label({
      label: summary,
      halign: Gtk.Align.START,
      xalign: 0,
      wrap: true,
      max_width_chars: 36,
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
      max_width_chars: 36,
    })
    b.add_css_class("nc-notif-body")
    inner.append(b)
  }

  const iconLabel = new Gtk.Label({ label: "󰍡", valign: Gtk.Align.START })
  iconLabel.add_css_class("nc-notif-icon-fallback")

  const closeBtn = new Gtk.Button({ label: "󰅖", valign: Gtk.Align.START })
  closeBtn.add_css_class("nc-notif-close")

  const row = new Gtk.Box({ spacing: 10 })
  row.add_css_class("nc-notif")
  row.append(iconLabel)
  row.append(inner)
  row.append(closeBtn)

  closeBtn.connect("clicked", () => {
    n.dismiss()
    const parent = row.get_parent()
    if (parent) (parent as Gtk.Box).remove(row)
  })

  return row
}

export default function Notifications() {
  const notifd = Notifd.get_default()
  const [isEmpty, setIsEmpty] = createState(
    notifd.get_notifications().length === 0,
  )

  const listBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 6,
  })

  const cardMap = new Map<number, Gtk.Widget>()

  const update = () => {
    const ns = notifd.get_notifications()
    setIsEmpty(ns.length === 0)

    // Remove cards no longer present
    for (const [id, widget] of cardMap) {
      if (!ns.find((n: any) => n.id === id)) {
        listBox.remove(widget)
        cardMap.delete(id)
      }
    }

    // Add new cards
    for (const n of ns) {
      if (!cardMap.has(n.id)) {
        const card = makeNotifCard(n)
        cardMap.set(n.id, card)
        listBox.prepend(card) // newest on top
      }
    }
  }

  update()

  // Connect to both signals — whichever fires on this version
  notifd.connect("notified", update)
  notifd.connect("resolved", update)

  // Fallback poll every 2s in case signals don't fire
  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
    update()
    return GLib.SOURCE_CONTINUE
  })

  return (
    <box
      cssClasses={["nc-notifications"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={6}
    >
      <box cssClasses={["nc-notif-header"]}>
        <label
          cssClasses={["nc-notif-title"]}
          label="NOTIFICATIONS"
          hexpand
          halign={Gtk.Align.START}
        />
        <button
          cssClasses={["nc-notif-clear-btn"]}
          label="Clear All"
          onClicked={() => {
            for (const n of notifd.get_notifications()) n.dismiss()
            for (const [, widget] of cardMap) listBox.remove(widget)
            cardMap.clear()
            setIsEmpty(true)
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
        <box orientation={Gtk.Orientation.VERTICAL} spacing={6}>
          <box
            cssClasses={["nc-notif-empty"]}
            orientation={Gtk.Orientation.VERTICAL}
            halign={Gtk.Align.CENTER}
            spacing={8}
            visible={isEmpty}
          >
            <label cssClasses={["nc-notif-empty-icon"]} label="󰂚" />
            <label
              cssClasses={["nc-notif-empty-label"]}
              label="No notifications"
            />
          </box>
          {listBox}
        </box>
      </scrolledwindow>
    </box>
  )
}
