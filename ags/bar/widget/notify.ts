import Gio from "gi://Gio"
import GLib from "gi://GLib"

export function notify({
  appName = "AGS",
  summary,
  body = "",
  urgency = 1,
  timeout = 4000,
}: {
  appName?: string
  summary: string
  body?: string
  urgency?: number
  timeout?: number
}) {
  // Fully async — never blocks the main thread
  try {
    const bus = Gio.bus_get_sync(Gio.BusType.SESSION, null)
    bus.call(
      "org.freedesktop.Notifications",
      "/org/freedesktop/Notifications",
      "org.freedesktop.Notifications",
      "Notify",
      new GLib.Variant("(susssasa{sv}i)", [
        appName,
        0,
        "",
        summary,
        body,
        [],
        { urgency: new GLib.Variant("y", urgency) },
        timeout,
      ]),
      null,
      Gio.DBusCallFlags.NONE,
      -1,
      null,
      null,
    )
  } catch (_) {}
}
