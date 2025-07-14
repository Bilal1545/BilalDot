import { App, Widget, Astal } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/Bar"
import Desktop from "./widget/desktop/desktop"
import OSD from "./widget/OSD"
import MediaPlayer from "./widget/MediaPlayer"
import Lock from "./widget/lockscreen/lock"
import Dock from "./widget/dock/Dock"
import Settings from "./widget/settings/settings"
import AppLauncher from "./widget/AppLauncher"
import Overview from "./widget/Overview"
import Power from "./widget/Power"
import Scss from "./widget/scss"
import Screenshot from "./widget/screenshot"
import Sidebar from "./widget/sidebar/Sidebar"
import NotificationPopups from "./widget/indicators/NotificationPopups"

App.start({
    requestHandler(request: string, res: (response: any) => void) {
        if (request == "say hi") {
            Scss()
        }
        res("unknown command")
    },
    css: style,
    main() {
        App.get_monitors().map(Desktop),
        App.get_monitors().map(Bar),
        App.get_monitors().map(Dock),
        App.get_monitors().map(Power),
        App.get_monitors().map(MediaPlayer),
        App.get_monitors().map(NotificationPopups),
        App.get_monitors().map(OSD),
        App.get_monitors().map(AppLauncher),
        App.get_monitors().map(Sidebar),
        App.get_monitors().map(Overview),
        App.get_monitors().map(Settings),
        App.get_monitors().map(Screenshot)
    },
})
