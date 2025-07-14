import { App } from "astal/gtk3"
import Apps from "gi://AstalApps"
import Wp from "gi://AstalWp"
import { Variable, GLib, bind, timeout } from "astal"
import { subprocess, exec, execAsync } from "astal/process"
//import MediaPlayer from "../indicators/MediaPlayer"
import { GObject } from "astal";
import { Astal, Gtk, Gdk, astalify } from "astal/gtk3"
import Brightness from "./Brightness"
import Notifications from "./Notifications"
import Network from "gi://AstalNetwork"
import { type Subscribable } from "astal/binding"
import { useRef, useEffect, useState } from "astal"
import option from "../options"
import Mpris from "gi://AstalMpris"
import Bluetooth from "gi://AstalBluetooth"

function BrightnessSlider() {
    const brightness = Brightness.get_default()

    return <box className="AudioSlider" css="min-width: 140px">
        <icon icon="weather-clear" />
        <slider
            hexpand
            value={bind(brightness, "screen")}
            onDragged={({ value }) => brightness.screen = value}
        />
    </box>
}

function MicrophoneSlider() {
    const microphone = Wp.get_default()?.audio.defaultMicrophone!

    return <box className="AudioSlider" css="min-width: 140px">
        <icon icon={bind(microphone, "volumeIcon")} />
        <slider
            hexpand
            onDragged={({ value }) => microphone.volume = value}
            value={bind(microphone, "volume")}
        />
    </box>
}

function AudioSlider() {
    const speaker = Wp.get_default()?.audio.defaultSpeaker!

    return <box className="AudioSlider" css="min-width: 140px">
        <icon icon={bind(speaker, "volumeIcon")} />
        <slider
            hexpand
            onDragged={({ value }) => speaker.volume = value}
            value={bind(speaker, "volume")}
        />
    </box>
}

function Time({ format = "%H:%M" }) {
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <label
            onDestroy={() => time.drop()}
            className="Time"
            label={time()}
        />
}

class Calendar extends astalify(Gtk.Calendar) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of Calendar.
     * @param props - The properties for the Calendar component.
     * @memberof Calendar
     */
    constructor(props: ConstructProps<Calendar, Gtk.Calendar.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default function Sidebar() {
    const wifi = Network.get_default()?.wifi!
    const bluetooth = Bluetooth.get_default()
    const mpris = Mpris.get_default()
    const wifiopened = false
    const speaker = Wp.get_default()?.audio.defaultSpeaker!
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
    let anchor
    if (option.bar.position === "bottom") {
        anchor = BOTTOM | RIGHT
    } else if (option.bar.position === "top"){ 
        anchor = TOP | RIGHT
    } else if (option.bar.position === "left") {
        anchor = LEFT | BOTTOM
    } else if (option.bar.position === "right") {
        anchor = RIGHT | BOTTOM
    } 

    const stack = Variable("notifications")
    const stack2 = Variable("calendar")
    const Gamemode = Variable(
        GLib.file_test(`${GLib.get_home_dir()}/.cache/bilaldot/gamemode-enabled`, GLib.FileTest.EXISTS) ? "active" : ""
    )


    timeout(2000, () => {
        stack.value = "notifications"
    })


    return <window 
        name="sidebar"
        application={App}
        visible={false} 
        className="Sidebar"
        anchor={anchor}>    
        <box className="sidebar" vertical>
            <box>
                <label label={GLib.get_user_name()} />
                <box className="group top" spacing={5} hexpand halign={Gtk.Align.END}>
                    <button onClicked={() => {
                        App.get_window("sidebar")!.hide()
                        setTimeout(function () {
                            execAsync("hyprctl dispatch exec grim ~/.cache/bilaldot/screenshot.png")
                            setTimeout(function () {
                            App.get_window("screenshot")!.show()
                            if (option.dock.enabled == true) {
                                App.get_window("dock")!.hide()
                            }
                            App.get_window("bar")!.hide()
                            }, 1000)
                        }, 1000)
                        
                    }}><icon icon="applets-screenshooter-symbolic" /></button>
                    <button onClicked={() => {
                        execAsync("hyprctl dispatch exec bilaldotsettings")
                        App.get_window("sidebar")!.hide()
                        App.toggle_window('settings-dialog');
                    }}><icon icon="org.gnome.Settings-system-symbolic" /></button>
                    <button onClicked={() => {
                        execAsync("hyprlock")
                        App.get_window("sidebar")!.hide()
                    }}><icon icon="system-lock-screen" /></button>
                    <button onClicked={() => {
                        App.get_window("power")!.show()
                        App.get_window("sidebar")!.hide()
                    }}><icon icon="system-shutdown" /></button>
                </box>
            </box>
            <box horizontal halign={Gtk.Align.CENTER} spacing={4} className="control">
                <button
                className={bind(wifi, "state").as(state =>
                    state === 100 ? "active thick" : "thick"
                )}
                onClicked={() => {
                    execAsync("nm-connection-editor")
                }}>
                <icon icon={bind(wifi, "iconName")} />
                </button>
                <button
                className={bind(Gamemode)}
                onClicked={() => {
                    execAsync("hyprctl dispatch exec ~/.config/bilaldot/scripts/gamemode.sh")
                }}>
                <icon icon={"applications-games-symbolic"} />
                </button>
            </box>
            <box vertical className={"group"}>
                <box hexpand className={"stackbar"}>
                    <button halign={Gtk.Align.CENTER} className={bind(stack).as(v => v == "notifications" ? "active" : "")} vertical hexpand onClick={() => stack.set("notifications")}><box vertical><icon icon={"org.gnome.Settings-notifications-symbolic"} /><label label="Notifications" /></box></button>
                    <button halign={Gtk.Align.CENTER} className={bind(stack).as(v => v == "volume" ? "active" : "")} vertical hexpand onClick={() => stack.set("volume")}><box vertical><icon icon={bind(speaker, "volumeIcon")} /><label label="Controls" /></box></button>
                </box>
                <stack shown={bind(stack)}>
                    <box name="notifications" vertical>
                        <Notifications />
                    </box>
                    <box name="volume" spacing={10} vertical>
                        <AudioSlider />
                        <BrightnessSlider />
                        <MicrophoneSlider />
                    </box>
                </stack>
            </box>
            <box className={"group horizontal"}>
                <box vexpand halign={Gtk.Align.START} vertical className={"stackbar horizontal"}>
                    <button halign={Gtk.Align.CENTER} vexpand valign={Gtk.Align.CENTER} className={bind(stack2).as(v => v == "calendar" ? "active" : "")} vertical hexpand onClick={() => stack2.set("calendar")}><box vertical><icon halign={Gtk.Align.CENTER} icon={"x-office-calendar-symbolic"} /><label label="Calendar" /></box></button>
                    <button halign={Gtk.Align.CENTER} vexpand valign={Gtk.Align.CENTER} className={bind(stack2).as(v => v == "todo" ? "active" : "")} vertical hexpand onClick={() => stack2.set("todo")}><box vertical><icon halign={Gtk.Align.CENTER} icon={"checkmark-symbolic"} /><label label="To-do" /></box></button>
                </box>
                <stack shown={bind(stack2)}>
                    <box name="calendar" vertical>
                        <box
                            className={'calendar-menu-item-container calendar'}
                            halign={Gtk.Align.FILL}
                            valign={Gtk.Align.FILL}
                            expand
                        >
                            <box className={'calendar-container-box'}>
                                <Calendar
                                    className={'calendar-menu-widget'}
                                    halign={Gtk.Align.FILL}
                                    valign={Gtk.Align.FILL}
                                    showDetails={false}
                                    expand
                                    showDayNames
                                    showHeading
                                />
                            </box>
                        </box>
                    </box>
                    <box name="todo" vertical>
                        <label label={"To-Do"} />
                    </box>
                    <box name={"none"} />
                </stack>
            </box>
            {/*<MediaPlayer />*/}
        </box>
    </window>
}


