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

export default function Screenshot() {
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

    return <window 
        name="screenshot"
        application={App}
        visible={false} 
        className="screenshot"
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        layer={Astal.Layer.OVERLAY}
        anchor={TOP | BOTTOM | LEFT | RIGHT}>    
        <box className="screenshot" vertical>
            <box className="group top" halign={Gtk.Align.END}>
                <button onClicked={() => {
                    execAsync("hyprshot")
                }}><icon icon="applets-screenshooter-symbolic" /></button>
                <button onClicked="hyprlock"><icon icon="system-lock-screen" /></button>
                <button onClicked="ags toggle power"><icon icon="system-shutdown" /></button>
            </box>
            <box css="padding-bottom:5px;"></box>
        </box>
    </window>
}


