import { App } from "astal/gtk3"
import Apps from "gi://AstalApps"
import Wp from "gi://AstalWp"
import { Variable, GLib, bind } from "astal"
import { subprocess, exec, execAsync } from "astal/process"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import option from "./options.js"

function hide() {
    App.get_window("screenshot")!.hide()
    if (option.dock.enabled == true) {
        App.get_window("dock")!.show()
    }
    App.get_window("bar")!.show()
}

export default function Screenshot() {
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

    return <window 
        name="screenshot"
        application={App}
        visible={false} 
        className="screenshot"
        keymode={Astal.Keymode.ON_DEMAND}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        layer={Astal.Layer.OVERLAY}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                hide()
        }}
        anchor={TOP | BOTTOM | LEFT | RIGHT}>    
        <box className="screenshot" vertical>
            <box className="buttons" spacing={5} halign={Gtk.Align.CENTER} vexpand valign={Gtk.Align.END}>
                <button onClicked={() => {
                    execAsync("hyprshot")
                }}><icon icon="applets-screenshooter-symbolic" /></button>
                <button onClicked={() => {
                    execAsync("cp ~/bilaldot/screenshot.png ~/Pictures/$(date +%s).png")
                }}><icon icon="view-fullscreen-symbolic" /></button>
                <box className="seperator" />
                <button onClicked={() => {
                    hide()
                }}><label label="X" /></button>
            </box>
            <box css="padding-bottom:5px;"></box>
        </box>
    </window>
}


