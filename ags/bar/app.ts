import app from "ags/gtk4/app"
import style from "./styles/style.scss"
import Bar from "./widget/Bar"
import OSD from "./widget/osd/OSD"
import NotificationCenter from "./widget/nc/NotificationCenter"
import NotificationPopups from "./widget/nc/NotificationPopups"
import { toggleNc } from "./widget/nc/NotificationCenter"

app.start({
  instanceName: "bar",
  css: style,
  main() {
    app.get_monitors().map((_, i) => Bar(i))
    OSD()
    NotificationCenter()
    NotificationPopups()
      ; (globalThis as any).toggleNc = toggleNc
  },
  requestHandler(argv: string[], res: (r: any) => void) {
    if (argv[0] === "toggleNc") {
      toggleNc()
      res("ok")
    }
  },
})
