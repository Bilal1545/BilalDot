import app from "ags/gtk4/app"
import style from "./style.scss"
import Sidebar from "./widget/Sidebar"
import Bar from "./widget/Bar"
import Applauncher from "./widget/Applauncher"
import Power from "./widget/Power"
import Notifications from "./widget/Notifications"
import NotificationsMenu from "./widget/NotificationsMenu"
import Overview from "./widget/Overview"

app.start({
  requestHandler(request: string, res: (response: any) => void) {
    if (request == "say hi") {
      
    }
    res("unknown command")
  },
  css: style,
  main() {
    app.get_monitors().map(Bar)
    app.get_monitors().map(Sidebar)
    app.get_monitors().map(Applauncher)
    app.get_monitors().map(Notifications)
    app.get_monitors().map(NotificationsMenu)
    app.get_monitors().map(Power)
    app.get_monitors().map(Overview)
  },
})
