import app from "ags/gtk4/app"
import style from "./styles/style.scss"
import Bar from "./widget/Bar"
import OSD from "./widget/osd/OSD"
import NotificationCenter from "./widget/nc/NotificationCenter"
import NotificationPopups from "./widget/nc/NotificationPopups"
import Dashboard from "./widget/dashboard/Dashboard"
import { toggleNc } from "./widget/nc/NotificationCenter"
import { toggleDashboard } from "./widget/dashboard/Dashboard"

app.start({
  instanceName: "bar",
  css: style,
  main() {
    app.get_monitors().map((_, i) => Bar(i))
    OSD()
    NotificationCenter()
    NotificationPopups()
    Dashboard()
      ; (globalThis as any).toggleNc = toggleNc
      ; (globalThis as any).toggleDashboard = toggleDashboard
  },
  requestHandler(argv: string[], res: (r: any) => void) {
    if (argv[0] === "toggleNc") {
      toggleNc()
      res("ok")
    }
    if (argv[0] === "toggleDashboard") {
      toggleDashboard()
      res("ok")
    }
  },
})
