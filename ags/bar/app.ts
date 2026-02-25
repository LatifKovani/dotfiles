import app from "ags/gtk4/app"
import style from "./styles/style.scss"
import Bar from "./widget/Bar"
import OSD from "./widget/osd/OSD"
import NotificationCenter from "./widget/nc/NotificationCenter"

app.start({
  css: style,
  main() {
    app.get_monitors().map((_, i) => Bar(i))
    OSD()
    NotificationCenter()
  },
})
