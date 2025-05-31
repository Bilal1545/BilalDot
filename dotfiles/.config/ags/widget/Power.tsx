import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable } from "astal"
import option from "./option.ts"
export default function Power() {
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
    let anchor
    if (option.bar.position === "bottom") {
        anchor = BOTTOM
    } else if (option.bar.position === "top"){ 
        anchor = TOP
    } else if (option.bar.position === "left") {
        anchor = LEFT
    } else if (option.bar.position === "right") {
        anchor = RIGHT
    } 
    return <window
        name="power"
        anchor={anchor}
        visible={false}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box className="Power">
            <button onClick="hyprctl dispatch exec ~/.config/bilaldot/scripts/power.sh shutdown">
                <icon icon="system-shutdown" />
            </button>
            <button onClick="hyprctl dispatch exec ~/.config/bilaldot/scripts/power.sh lock">
                <icon icon="system-lock-screen" />
            </button>
            <button onClick="hyprctl dispatch exec ~/.config/bilaldot/scripts/power.sh reboot">
                <icon icon="system-reboot-symbolic" />
            </button>
            <button onClick="hyprctl dispatch exec ~/.config/bilaldot/scripts/power.sh exit">
                <icon icon="system-log-out" /> 
            </button>
            <button onClick="hyprctl dispatch exec ~/.config/bilaldot/scripts/power.sh suspend">
                <icon icon="weather-clear-night" />
            </button>
        </box>
    </window>
}
