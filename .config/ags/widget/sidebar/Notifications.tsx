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
import option from "./option.js"
import Bluetooth from "gi://AstalBluetooth"
import Notification from "../indicators/Notification.js"
import Notifd from "gi://AstalNotifd"

class NotifiationMap implements Subscribable {
    private map: Map<number, Gtk.Widget> = new Map()
    private var: Variable<Array<Gtk.Widget>> = Variable([])

    private notifiy() {
        this.var.set([...this.map.values()].reverse())
    }

    constructor() {
        const notifd = Notifd.get_default()

        notifd.connect("notified", (_, id) => {
            this.set(id, Notification({
                notification: notifd.get_notification(id)!,
            }))
        })

        notifd.connect("resolved", (_, id) => {
            this.delete(id)
        })
    }

    private set(key: number, value: Gtk.Widget) {
        this.map.get(key)?.destroy()
        this.map.set(key, value)
        this.notifiy()
    }

    private delete(key: number) {
        this.map.get(key)?.destroy()
        this.map.delete(key)
        this.notifiy()
    }

    get() {
        return this.var.get()
    }

    subscribe(callback: (list: Array<Gtk.Widget>) => void) {
        return this.var.subscribe(callback)
    }

    clearAll() {
        const notifd = Notifd.get_default()
        for (const id of this.map.keys()) {
            const n = notifd.get_notification(id)
            n?.dismiss()
        }
    }
}

const notifs = new NotifiationMap()

export default function NotificationsMenu() {
    const wifi = Network.get_default()?.wifi!
    const bluetooth = Bluetooth.get_default()
    const mpris = Mpris.get_default()
    const notifd = Notifd.get_default()
    const wifiopened = false

    return <box vertical>
        <scrollable vscroll heightRequest={400} noImplicitDestroy>
            <box noImplicitDestroy vertical>
                {bind(notifs)}
            </box>
        </scrollable>
        <box className={"actions"} valign={Gtk.Align.END} hexpand>
            <button
                className={'clear-notifications-button'}
                tooltipText={'Clear Notifications'}
                halign={Gtk.Align.END}
                hexpand
                onClick={(_, event) => {
                    notifs.clearAll()
                }}>
                <box>
                    <label label="Clear " />
                    <icon icon="user-trash-symbolic" />
                </box>
            </button>
        </box>
    </box>
}


