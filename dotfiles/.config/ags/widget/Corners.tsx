import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable } from "astal"
import option from "./option.ts"
export default function Power() {
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
    let corner1h
    let corner1v
    let corner2h
    let corner2v
    if (option.bar.position === "bottom") {
        let corner2h = Gtk.Align.END;
        let corner2v = Gtk.Align.END;
        let corner1h = Gtk.Align.START;
        let corner1v = Gtk.Align.END;
    } else if (option.bar.position === "top"){ 
        let corner2h = Gtk.Align.END;
        let corner2v = Gtk.Align.START;
        let corner1h = Gtk.Align.START;
        let corner1v = Gtk.Align.START;
    } else if (option.bar.position === "left") {
        let corner2h = Gtk.Align.START;
        let corner2v = Gtk.Align.END;
        let corner1h = Gtk.Align.START;
        let corner1v = Gtk.Align.START;
    } else if (option.bar.position === "right") {
        let corner2h = Gtk.Align.END;
        let corner2v = Gtk.Align.END;
        let corner1h = Gtk.Align.END;
        let corner1v = Gtk.Align.START;
    } 
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
            <box className="corner" valign={corner1v} halign={corner1h} />
            <box className="corner" valign={corner2v} halign={corner2h} />
        </box>
    </window>
}
