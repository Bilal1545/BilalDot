import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import RegularWindow from '../RegularWindow';
import { Variable, bind } from "astal"

export default function Option(props) {
    return <box className={"option"}>
        <label label={props.label} />
    </box>
}