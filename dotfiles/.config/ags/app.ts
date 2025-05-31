import { App, Widget, Astal } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/Bar"
import Desktop from "./widget/desktop/desktop"
import OSD from "./widget/OSD"
import Overview from "./widget/overview"
import Lock from "./widget/lockscreen/lock"
import Dock from "./widget/Dock"
import Settings from "./widget/settings/settings"
import AppLauncher from "./widget/AppLauncher"
import Power from "./widget/Power"
import Screenshot from "./widget/screenshot"
import Sidebar from "./widget/sidebar/Sidebar"
import NotificationPopups from "./widget/indicators/NotificationPopups"

App.start({
    css: style,
    main() {
        App.get_monitors().map(Desktop),
        App.get_monitors().map(Bar),
        App.get_monitors().map(Dock),
        App.get_monitors().map(Power),
        App.get_monitors().map(NotificationPopups),
        App.get_monitors().map(OSD),
        App.get_monitors().map(AppLauncher),
        App.get_monitors().map(Sidebar),
        App.get_monitors().map(Overview),
        App.get_monitors().map(Settings),
        App.get_monitors().map(Screenshot)
    },
})
