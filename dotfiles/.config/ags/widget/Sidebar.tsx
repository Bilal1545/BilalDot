import { App } from "astal/gtk3"
import Apps from "gi://AstalApps"
import Wp from "gi://AstalWp"
import { Variable, GLib, bind } from "astal"
import { subprocess, exec, execAsync } from "astal/process"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import Brightness from "./Brightness"


function BrightnessSlider() {
    const brightness = Brightness.get_default()

    return <box className="AudioSlider" css="min-width: 140px">
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

function takescreenshot() {
    execAsync("nwg-bar -t screenshot.json")
    App.get_window("sidebar")!.hide()
}

function colorpicker() {
    execAsync("nwg-bar -t colorpicker.json")
    App.get_window("sidebar")!.hide()
}


function emojipicker() {
    execAsync("hyprctl dispatch exec smile")
    App.get_window("sidebar")!.hide()
}

function opensettingsapp() {
    execAsync("hyprctl dispatch exec bilaldotsettings")
    App.get_window("sidebar")!.hide()
}

function openwelcomeapp() {
    execAsync("hyprctl dispatch exec bilaldotwelcome")
    App.get_window("sidebar")!.hide()
}

function openwallpaper() {
    execAsync("hyprctl dispatch exec $HOME/.local/bin/waypaper")    
    App.get_window("sidebar")!.hide()
}

function openwaybarthemes() {
    execAsync("hyprctl dispatch exec $HOME/.config/waybar/themeswitcher.sh") 
    App.get_window("sidebar")!.hide()
}

function powerlock() {
    execAsync("hyprctl dispatch exec $HOME/.config/bilaldot/scripts/power.sh lock")    
    App.get_window("sidebar")!.hide()
}

function powerlogout() {
    execAsync("hyprctl dispatch exec $HOME/.config/bilaldot/scripts/power.sh exit")    
    App.get_window("sidebar")!.hide()    
}

function powersuspend() {
    execAsync("hyprctl dispatch exec $HOME/.config/bilaldot/scripts/power.sh susbend")
    App.get_window("sidebar")!.hide()
}

function powerrestart() {
    execAsync("hyprctl dispatch exec $HOME/.config/bilaldot/scripts/power.sh reboot")  
    App.get_window("sidebar")!.hide()
}

function powerexit() {
    execAsync("hyprctl dispatch exec $HOME/.config/bilaldot/scripts/power.sh shutdown")
    App.get_window("sidebar")!.hide()
}
async function getGtkTheme() {
    const result = await execAsync("gsettings get org.gnome.desktop.interface color-scheme");
    return result.trim() === "'prefer-dark'" ? "dark" : "light";
}
getGtkTheme().then(theme => theme);

export default function Sidebar() {
    
    const anchor = Astal.WindowAnchor.TOP
        | Astal.WindowAnchor.RIGHT

    return <window 
    name="sidebar"
    application={App}
    visible={false} 
    className="Sidebar"
    anchor={anchor}
    keymode={Astal.Keymode.ON_DEMAND}
    onKeyPressEvent={function (self, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape)
            self.hide()
    }}      
    >    
    <box className="sidebar" vertical>
        <box css="padding-bottom:20px;" horizontal>
                    <button className="bilaldoticon"></button>
        </box>
                    <box homogeneous className="btnbar">
                    <button onClicked={opensettingsapp} className="btn">Settings</button>
		    <button onClicked={openwelcomeapp} className="btn">Welcome</button>
                    </box>
                     <box css="padding-bottom:10px;"></box>
        <label css="padding-bottom:10px" className="ctrlsortls text" label="Tools"></label>
                <box horizontal homogeneous><button onClicked={openwallpaper} css="margin-bottom:10px" className="btnbar">Change Wallpaper</button></box>
                <box horizontal homogeneous><button onClicked={openwaybarthemes} css="margin-bottom:10px" className="btnbar">Change Waybar Theme</button></box>
                <box horizontal homogeneous><button onClicked={takescreenshot} css="margin-bottom:10px" className="btnbar">Take Screenshot</button></box>
                <box horizontal homogeneous><button onClicked={emojipicker} css="margin-bottom:10px" className="btnbar">Pick Emoji</button></box>
                <box horizontal homogeneous><button onClicked={colorpicker} css="margin-bottom:10px" className="btnbar">Colorpicker</button></box>
        <box css="padding-bottom:140px;"></box>
        <label css="padding-bottom:10px" className="ctrlsortls text" label="Controls"></label>
        <box className="group" halign="left" vertical>
            <label css="padding-bottom:10px" className="text" label="Speaker"></label>
            <AudioSlider/>
            <label css="padding-bottom:10px" className="text" label="Microphone"></label>
            <MicrophoneSlider />
        </box>
        <box css="padding-bottom:20px;"></box>
        <box className="group" halign="left" vertical>
            <label css="padding-bottom:10px" className="text" label="Brightness"></label>
            <BrightnessSlider />
        </box>
        <box css="padding-bottom:20px;"></box>
        <centerbox horizontal className="group">
            <label vexpand label=""></label>
            <box>
                <button onClicked={powerlock} className="btnbar first lock text"></button>
                <button onClicked={powerlogout} className="btnbar logout text"></button>
                <button onClicked={powersuspend} className="btnbar suspend text"></button>
                <button onClicked={powerrestart} className="btnbar restart text"></button>
                <button onClicked={powerexit} className="btnbar last exit text"></button>
            </box>
            <label vexpand label=""></label>
        </centerbox>
   </box>
</window>
}
