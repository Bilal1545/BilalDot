import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable } from "astal"
import option from "./options.js"
export default function Power() {
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
    return <window
        name="power"
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        anchor={ TOP | BOTTOM | LEFT | RIGHT }
        layer={Astal.Layer.BOTTOM}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box>
            
        </box>
    </window>
}
