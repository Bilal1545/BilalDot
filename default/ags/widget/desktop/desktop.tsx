import { App } from "astal/gtk3"
import Apps from "gi://AstalApps"
import Wp from "gi://AstalWp"
import { Variable, GLib, bind } from "astal"
import { subprocess, exec, execAsync } from "astal/process"
import { Astal, Gtk, Gdk, App, astalify } from "astal/gtk3"
import { GObject } from "astal";
import Network from "gi://AstalNetwork"
import { type Subscribable } from "astal/binding"
import { useRef, useEffect, useState } from "astal"
import Mpris from "gi://AstalMpris"
import option from "../options.js"
import Apps from "gi://AstalApps"

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
    const apps = new Apps.Apps()
    const text = Variable("browser")
    const list = text(text => apps.fuzzy_query(text))

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
        </box>
    </window>
}

