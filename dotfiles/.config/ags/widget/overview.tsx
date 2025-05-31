import { App } from "astal/gtk3"
import Apps from "gi://AstalApps"
import Wp from "gi://AstalWp"
import { GObject } from "astal";
import { Variable, GLib, bind } from "astal"
import { subprocess, exec, execAsync } from "astal/process"
import { Astal, Gtk, Gdk, astalify } from "astal/gtk3"
import Network from "gi://AstalNetwork"
import { type Subscribable } from "astal/binding"
import { useRef, useEffect, useState } from "astal"
import Mpris from "gi://AstalMpris"
import option from "./option.ts"
import Bluetooth from "gi://AstalBluetooth"
import Notification from "./indicators/Notification"
import Notifd from "gi://AstalNotifd"

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

class NotifiationMap implements Subscribable {
    // the underlying map to keep track of id widget pairs
    private map: Map<number, Gtk.Widget> = new Map()

    // it makes sense to use a Variable under the hood and use its
    // reactivity implementation instead of keeping track of subscribers ourselves
    private var: Variable<Array<Gtk.Widget>> = Variable([])

    // notify subscribers to rerender when state changes
    private notifiy() {
        this.var.set([...this.map.values()].reverse())
    }

    constructor() {
        const notifd = Notifd.get_default()

        /**
         * uncomment this if you want to
         * ignore timeout by senders and enforce our own timeout
         * note that if the notification has any actions
         * they might not work, since the sender already treats them as resolved
         */
        // notifd.ignoreTimeout = true

        notifd.connect("notified", (_, id) => {
            this.set(id, Notification({
                notification: notifd.get_notification(id)!,

                // once hovering over the notification is done
                // destroy the widget without calling notification.dismiss()
                // so that it acts as a "popup" and we can still display it
                // in a notification center like widget
                // but clicking on the close button will close it

                // notifd by default does not close notifications
                // until user input or the timeout specified by sender
                // which we set to ignore above
            }))
        })

        // notifications can be closed by the outside before
        // any user input, which have to be handled too
        notifd.connect("resolved", (_, id) => {
            this.delete(id)
        })
    }

    private set(key: number, value: Gtk.Widget) {
        // in case of replacecment destroy previous widget
        this.map.get(key)?.destroy()
        this.map.set(key, value)
        this.notifiy()
    }

    private delete(key: number) {
        this.map.get(key)?.destroy()
        this.map.delete(key)
        this.notifiy()
    }

    // needed by the Subscribable interface
    get() {
        return this.var.get()
    }

    // needed by the Subscribable interface
    subscribe(callback: (list: Array<Gtk.Widget>) => void) {
        return this.var.subscribe(callback)
    }
}

class CalendarGtk extends astalify(Gtk.Calendar) {
	static {
		GObject.registerClass(this);
	}

	constructor(
		props: ConstructProps<Gtk.Calendar, Gtk.Calendar.ConstructorProps>,
	) {
		super(props as any);
	}
}

const notifs = new NotifiationMap()

const clearNotifications = async (
    notifications: AstalNotifd.Notification[],
    delay: number,
): Promise<void> => {
    removingNotifications.set(true);
    for (const notification of notifications) {
        notification.dismiss();
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
    removingNotifications.set(false);
};

export default function Overview() {
    const wifi = Network.get_default()?.wifi!
    const bluetooth = Bluetooth.get_default()
    const mpris = Mpris.get_default()
    const wifiopened = false
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
    let anchor
    if (option.bar.position === "bottom") {
        anchor = BOTTOM | RIGHT | LEFT
    } else if (option.bar.position === "top"){ 
        anchor = TOP | RIGHT | LEFT
    } else if (option.bar.position === "left") {
        anchor = RIGHT | LEFT | BOTTOM
    } else if (option.bar.position === "right") {
        anchor = RIGHT | LEFT | BOTTOM
    } 

    return <window 
        name="overview"
        application={App}
        visible={false} 
        className="Overview"
        anchor={anchor}>    
        <box className="overview" halign={Gtk.Align.CENTER} horizontal>
            <box css="min-width: 450px;" vertical noImplicitDestroy>
                <label valign={Gtk.Align.START} halign={Gtk.Align.START} css="margin: 10px;font-size: 14px;" label="Notifications" />
                <button
            className={'clear-notifications-button'}
            tooltipText={'Clear Notifications'}
            onClick={(_, event) => {
                clearNotifications(notifdService.get_notifications(), clearDelay.get());
            }}
        ><label label="aaa"></label></button>
                <scrollable vscroll heightRequest={400} noImplicitDestroy>
                    <box noImplicitDestroy vertical>
                        {bind(notifs)}
                    </box>
                </scrollable>
            </box>
            <box vertical>
                <Time />
                <box 
                    className="calendar">{new CalendarGtk({ 
                    hexpand: true, 
                    vexpand: true,
                    showDayNames: true,
                    showDetails: false,
                    showHeading: true,
                    showWeekNumbers: true
                })}</box>
            </box>
        </box>
    </window>
}


