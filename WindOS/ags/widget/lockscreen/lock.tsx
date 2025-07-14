import { App } from "astal/gtk3"
import Apps from "gi://AstalApps"
import Wp from "gi://AstalWp"
import { Variable, GLib, bind } from "astal"
import { subprocess, exec, execAsync } from "astal/process"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import Network from "gi://AstalNetwork"
import { type Subscribable } from "astal/binding"
import { useRef, useEffect, useState } from "astal"
import Mpris from "gi://AstalMpris"
import option from "./option.ts"
import Bluetooth from "gi://AstalBluetooth"

export default function Lock() {
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

    const password = Variable("")

    return <window 
        name="lock"
        application={App}
        visible={false} 
        className="lock"
        focusable={true}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        layer={Astal.Layer.OVERLAY}
        anchor={TOP | BOTTOM | LEFT | RIGHT}>    

        <box className="lock" vertical>
            <entry 
                onActivate={(self) => {
                    const value = self.get_text()
                    execAsync(`~/.config/ags/widget/lockscreen/auth.py "${value}"`)
                }}
            />
        </box>
    </window>
}

