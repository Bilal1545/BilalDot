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
import option from "../options.js"

function Time() {
    const whole_hour = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%H:%M")!)
    const hour = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%H")!)
    const minute = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%M")!)

    return <label
        className="Time"
        onDestroy={() => whole_hour.drop()}
        label={whole_hour()}
    />
}

export default function Desktop() {
    const wifi = Network.get_default()?.wifi!
    const mpris = Mpris.get_default()
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

    return <window 
        name="desktop"
        application={App}
        layer={Astal.Layer.BOTTOM}
        className="Desktop"
        namespace="desktop"
        anchor={TOP | BOTTOM | LEFT | RIGHT}
        keymode={Astal.Keymode.ON_DEMAND}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}      
    >    
        <box className="desktop">
            <button
                tooltipText="File Manager"
                visible={option.desktop.filemanager}
                valign={Gtk.Align.START}
                onClicked={() => execAsync("hyprctl dispatch exec ~/.config/bilaldot/settings/file-manager.sh")}>
                <box vertical>
                    <icon icon="system-file-manager" />
                </box>
            </button>
            <button
                tooltipText="Terminal Emulator"
                visible={option.desktop.terminal}
                valign={Gtk.Align.START}
                onClicked={() => execAsync("hyprctl dispatch exec ~/.config/bilaldot/settings/terminal.sh")}>
                <box vertical>
                    <icon icon="utilities-terminal" />
                </box>
            </button>
            <button
                tooltipText="Text Editor"
                visible={option.desktop.texteditor}
                valign={Gtk.Align.START}
                onClicked={() => execAsync("hyprctl dispatch exec ~/.config/bilaldot/settings/text-editor.sh")}>
                <box vertical>
                    <icon icon="accessories-text-editor" />
                </box>
            </button>
        </box>
    </window>
}

