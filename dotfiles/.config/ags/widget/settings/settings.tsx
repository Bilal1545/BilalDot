import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import RegularWindow from '../RegularWindow';
import { Variable, bind } from "astal"
import Option from "./Option"
import { options } from "../options"

let deneme

console.log(deneme)

function denemef() {
    deneme = Variable(true)
    console.log(deneme)
}

export default function Settings() {

    const page = Variable("notifications")

    return <RegularWindow
        name={'settings-dialog'}
        className={'settings'}
        application={App}
        visible={false}>
        <box>
            <box vertical spacing={5} className={"stackbar"}>
                <button halign={Gtk.Align.FILL} className={bind(page).as(v => v == "notifications" ? "active" : "")} vertical onClick={() => page.set("notifications")}><box><icon icon={"applications-system-symbolic"} /><label label={"General"} /></box></button>
                <button halign={Gtk.Align.FILL} className={bind(page).as(v => v == "volume" ? "active" : "")} vertical onClick={() => page.set("volume")}></button>
            </box>
            <stack halign={Gtk.Align.FILL} shown={bind(page)}>
                <box name="notifications" hexpand halign={Gtk.Align.FILL} vertical>
                    <label label="notifications" /><switch valign={Gtk.Align.START} halign={Gtk.Align.END} onNotifyActive={self => print("switched to", self.active)} />
                    <Option label={"deneme"} />
                </box>
                <box name="volume" hexpand halign={Gtk.Align.FILL} vertical>
                    <label label="volume" /><switch valign={Gtk.Align.START} onNotifyActive={self => print("switched to", self.active)} />
                </box>
            </stack>
        </box>
    </RegularWindow>
}