import { App } from "astal/gtk3"
import Apps from "gi://AstalApps"
import Wp from "gi://AstalWp"
import { Variable, GLib, bind } from "astal"
import { subprocess, exec, execAsync } from "astal/process"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import Brightness from "./Brightness"
import Network from "gi://AstalNetwork"
import { type Subscribable } from "astal/binding"
import { useRef, useEffect, useState } from "astal"
import Mpris from "gi://AstalMpris"
import option from "../option.ts"
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

function MicrophoneSlider() {
    const microphone = Wp.get_default()?.audio.defaultMicrophone!

    return <box className="AudioSlider" css="min-width: 140px">
        <slider
            hexpand
            onDragged={({ value }) => microphone.volume = value}
            value={bind(microphone, "volume")}
        />
    </box>
}

function opensettingsapp() {
    execAsync("hyprctl dispatch exec bilaldotsettings")
    App.get_window("sidebar")!.hide()
    App.toggle_window('settings-dialog');
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

function lengthStr(length: number) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}


function MediaPlayer({ player }: { player: Mpris.Player }) {
    const { START, END } = Gtk.Align

    const title = bind(player, "title").as(t =>
        t || "Unknown Track")

    const artist = bind(player, "artist").as(a =>
        a || "Unknown Artist")

    const coverArt = bind(player, "coverArt").as(c =>
        `background-image: url('${c}')`)

    const playerIcon = bind(player, "entry").as(e =>
        Astal.Icon.lookup_icon(e) ? e : "audio-x-generic-symbolic")

    const position = bind(player, "position").as(p => player.length > 0
        ? p / player.length : 0)

    const playIcon = bind(player, "playbackStatus").as(s =>
        s === Mpris.PlaybackStatus.PLAYING
            ? "media-playback-pause-symbolic"
            : "media-playback-start-symbolic"
    )

    return <box className="MediaPlayer">
        <box className="cover-art" css={coverArt} />
        <box vertical>
            <box className="title">
                <label truncate hexpand halign={START} label={title} />
                <icon icon={playerIcon} />
            </box>
            <label halign={START} valign={START} vexpand wrap label={artist} />
            <slider
                visible={bind(player, "length").as(l => l > 0)}
                onDragged={({ value }) => player.position = value * player.length}
                value={position}
            />
            <centerbox className="actions">
                <label
                    hexpand
                    className="position"
                    halign={START}
                    visible={bind(player, "length").as(l => l > 0)}
                    label={bind(player, "position").as(lengthStr)}
                />
                <box>
                    <button
                        onClicked={() => player.previous()}
                        visible={bind(player, "canGoPrevious")}>
                        <icon icon="media-skip-backward-symbolic" />
                    </button>
                    <button
                        onClicked={() => player.play_pause()}
                        visible={bind(player, "canControl")}>
                        <icon icon={playIcon} />
                    </button>
                    <button
                        onClicked={() => player.next()}
                        visible={bind(player, "canGoNext")}>
                        <icon icon="media-skip-forward-symbolic" />
                    </button>
                </box>
                <label
                    className="length"
                    hexpand
                    halign={END}
                    visible={bind(player, "length").as(l => l > 0)}
                    label={bind(player, "length").as(l => l > 0 ? lengthStr(l) : "0:00")}
                />
            </centerbox>
        </box>
    </box>
}

export default function Sidebar() {
    const wifi = Network.get_default()?.wifi!
    const bluetooth = Bluetooth.get_default()
    const mpris = Mpris.get_default()
    const wifiopened = false
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

    return <window 
        name="sidebar"
        application={App}
        visible={false} 
        className="Sidebar"
        anchor={anchor}>    
        <box className="sidebar" vertical>
            <box className="group top" halign={Gtk.Align.END}>
                <button onClicked={() => {
                    execAsync("hyprshot")
                }}><icon icon="applets-screenshooter-symbolic" /></button>
                <button onClicked={opensettingsapp}><icon icon="org.gnome.Settings-system-symbolic" /></button>
                <button onClicked="hyprlock"><icon icon="system-lock-screen" /></button>
                <button onClicked={"ags toggle power"}><icon icon="system-shutdown" /></button>
            </box>
            <box horizontal className="control">
                <button
                className={bind(wifi, "state").as(state =>
                    state === 100 ? "active" : ""
                )}
                onClicked={() => {
                    execAsync("nm-connection-editor")
                }}>
                <box>
                    <icon icon={bind(wifi, "iconName")} />
                    <label 
                    label={bind(wifi, "ssid").as(s => 
                        s ? (s.length > 7 ? s.slice(0, 10) + "…" : s) : "Not connected")} 
                    className="wifi-ssid" 
                    tooltipText={bind(wifi, "ssid")}
                    halign={Gtk.Align.CENTER} 
                    />
                </box>
                </button>
            </box>
            <box css="padding-bottom:5px;"></box>
            <box className="group" vertical>
                <AudioSlider />
                <box css="padding-bottom:10px;"></box>
                <BrightnessSlider />
            </box>
            <box css="padding-bottom:5px;"></box>
            <box className="media-players" vertical>
            {bind(mpris, "players").as(arr => arr.map(player => (
                <MediaPlayer player={player} />
            )))}
            </box>
            <box css="padding-bottom:5px;"></box>
        </box>
    </window>
}


