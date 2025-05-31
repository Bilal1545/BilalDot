import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import RegularWindow from '../RegularWindow';
import { Variable } from "astal"

let deneme

console.log(deneme)

function denemef() {
    deneme = Variable(true)
    console.log(deneme)
}

export default function Applauncher() {

    return <RegularWindow
        name={'settings-dialog'}
        className={'settings'}
        application={App}
        visible={false}>
        <box>
        </box>
    </RegularWindow>
}