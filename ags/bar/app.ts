import app from "ags/gtk4/app"
import style from "./styles/style.scss"
import Bar from "./widget/Bar"
import OSD from "./widget/osd/OSD"
import NotificationCenter from "./widget/nc/NotificationCenter"
import NotificationPopups from "./widget/nc/NotificationPopups"
import Dashboard from "./widget/dashboard/Dashboard"
import { toggleNc } from "./widget/nc/NotificationCenter"
import { toggleDashboard } from "./widget/dashboard/Dashboard"
import GLib from "gi://GLib"

app.start({
  instanceName: "bar",
  css: style,
  main() {
    app.get_monitors().map((_, i) => Bar(i))
    OSD()
    NotificationCenter()
    NotificationPopups()
    Dashboard()

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
      try {
        const [ok, data] = GLib.file_get_contents("/tmp/ags-toggle")
        if (ok && data) {
          const cmd = new TextDecoder().decode(data).trim()
          if (cmd === "toggleNc") {
            toggleNc()
            GLib.file_set_contents(
              "/tmp/ags-toggle",
              new TextEncoder().encode(""),
            )
          }
          if (cmd === "toggleDashboard") {
            toggleDashboard()
            GLib.file_set_contents(
              "/tmp/ags-toggle",
              new TextEncoder().encode(""),
            )
          }
        }
      } catch (_) {}
      return GLib.SOURCE_CONTINUE
    })
  },
})
