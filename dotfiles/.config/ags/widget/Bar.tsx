import { App } from "astal/gtk3"
import { Variable, GLib, bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import Hyprland from "gi://AstalHyprland"
import Mpris from "gi://AstalMpris"
import Battery from "gi://AstalBattery"
import Wp from "gi://AstalWp"
import Network from "gi://AstalNetwork"
import Tray from "gi://AstalTray"
import option from "./option.ts"
import { subprocess, exec, execAsync } from "astal/process"

function SysTray() {
    const tray = Tray.get_default()

    return <box vertical={vertical_control()} className="SysTray">
        {bind(tray, "items").as(items => items.map(item => (
            <menubutton
                tooltipMarkup={bind(item, "tooltipMarkup")}
                usePopover={false}
                actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
                menuModel={bind(item, "menuModel")}>
                <icon gicon={bind(item, "gicon")} />
            </menubutton>
        )))}
    </box>
}

function BatteryLevel() {
    const bat = Battery.get_default()

    return <box className="Battery"
        visible={bind(bat, "isPresent")}>
        <icon icon={bind(bat, "batteryIconName")} />
        <levelbar value={bind(bat, "percentage")} />
    </box>
}

function Workspaces() {
    const hypr = Hyprland.get_default()

    return <box vertical={vertical_control()} className="Workspaces">
        {bind(hypr, "workspaces").as(wss => wss
            .filter(ws => !(ws.id >= -99 && ws.id <= -2)) // filter out special workspaces
            .sort((a, b) => a.id - b.id)
            .map(ws => (
                <button
                    className={bind(hypr, "focusedWorkspace").as(fw =>
                        ws === fw ? "focused" : "")}
                    onClicked={() => ws.focus()}>
                    {ws.id}
                </button>
            ))
        )}
    </box>
}
function FocusedClient() {
    const hypr = Hyprland.get_default()
    const focused = bind(hypr, "focusedClient")

    return <box
        className="Focused"
        visible={focused.as(Boolean)}>
        {focused.as(client => (
            client && <label className="FocusedClient" halign={Gtk.Align.START} label={bind(client, "initialTitle").as(String)} />
        ))}
    </box>
}
function vertical_control(): boolean {
    return option.bar.position === "left" || option.bar.position === "right"
}
function Time() {
    const whole_hour = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%H:%M")!)
    const hour = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%H")!)
    const minute = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%M")!)

    return <button onClick="ags toggle overview">
    <label
        className="Time"
        onDestroy={() => whole_hour.drop()}
        label={whole_hour()}
    />
    </button>
}
export default function Bar(monitor: Gdk.Monitor) {
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
    const speaker = Wp.get_default()!.get_default_speaker()
    const wifi = Network.get_default()?.wifi!
    const bat = Battery.get_default()
    let anchor
    if (option.bar.position === "bottom") {
        anchor = BOTTOM | LEFT | RIGHT
    } else if (option.bar.position === "top"){ 
        anchor = TOP | LEFT | RIGHT
    } else if (option.bar.position === "left") {
        anchor = LEFT | TOP | BOTTOM
    } else if (option.bar.position === "right") {
        anchor = RIGHT | TOP | BOTTOM
    } 
    return <window
        name="bar"
        application={App}
        className="Bar"
        visible={option.bar.enabled === true ? true : false}
        gdkmonitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={anchor}>
        <centerbox vertical={vertical_control()}>
            <box vertical={vertical_control()} hexpand valign={option.bar.position === "left" || option.bar.position === "right" ? Gtk.Align.START : Gtk.Align.CENTER}>
                
                <Workspaces />
                { /* <box className="dot" halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} />
                 <FocusedClient /> */ }
            </box>
            <box vertical={vertical_control()}>
                <button onClick="hyprctl dispatch exec waypaper"><icon icon="preferences-desktop-wallpaper" /></button>
                <box className="dot" halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} />
                <Time />
                <box className="dot" halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} />
                <button onClicked={() => {
                    execAsync("hyprshot")
                }}><icon icon="applets-screenshooter-symbolic" /></button>
            </box>
            <box hexpand vertical={vertical_control()} halign={option.bar.position === "left" || option.bar.position === "right" ? Gtk.Align.CENTER : Gtk.Align.END} valign={option.bar.position === "left" || option.bar.position === "right" ? Gtk.Align.END : Gtk.Align.CENTER}>
                <SysTray />
                <box visible={bind(bat, "isPresent")} className="dot" halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} />
                <BatteryLevel />
                <box className="dot" halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} />
                <button onClicked={() => {
                    execAsync("ags toggle sidebar")
                }}>
                    <box className="sidebar-button" vertical={vertical_control()}>
                        <icon icon={bind(speaker, "volumeIcon")} />
                        <icon icon={bind(wifi, "iconName")} />
                        <icon icon="system-shutdown" />
                    </box>
                </button>
            </box>
        </centerbox>
    </window>
}

