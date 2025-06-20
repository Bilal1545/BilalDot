import { App } from "astal/gtk3";
import { Variable, GLib, bind } from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import option from "../options.js"
import { subprocess, exec, execAsync } from "astal/process"

function launchApp(app: string) {
    const parts = app.split(".");
    const lastPart = parts[parts.length - 1];
    execAsync(lastPart.toLowerCase());
    execAsync(`flatpak run ${app}`);
}

function vertical_control(): boolean {
    return option.dock.position === "left" || option.dock.position === "right"
}

function Dock() {
    const hypr = Hyprland.get_default();

    const pinnedApps = option.dock.pinned_apps;

    return <window
        className="Dock"
        name={"dock"}
        application={App}
        exclusivity={option.dock.exclusive === true ? Astal.Exclusivity.EXCLUSIVE : false}
        anchor={Astal.WindowAnchor[option.dock.position.toUpperCase()]}>
        <box vertical={vertical_control()} className="dock" spacing={4} halign={Gtk.Align.CENTER}>
            <button tooltipText="Launcher"
                className="launcher"
                onClicked={() => execAsync("ags toggle launcher")}>
                <icon className="active" icon="view-app-grid-symbolic" />
            </button>
            <box className="seperator" />

            {bind(hypr, "clients").as(clients =>
                clients
                    .slice()
                    .sort((a, b) => a.workspace.id - b.workspace.id)
                    .map((client, index) => (
                        <box key={`client-${index}`} orientation={Gtk.Orientation.VERTICAL} halign={Gtk.Align.CENTER}>
                            <button
                                tooltipText={client.initialTitle}
                                onClicked={() => client.focus()}
                                className={client.focused ? "active" : ""}>
                                <icon
                                    icon={client.initialTitle.toLowerCase().replace(/\s+/g, '-')} />
                                <box className={"dot"} />
                            </button>
                        </box>
                    ))
            )}
            {pinnedApps.map((app, index) => (
                <button key={`pinned-${index}`}
                    tooltipText={app}
                    className={"not-executed"}
                    onClicked={() => launchApp(app)}>
                    <icon icon={app} />
                </button>
            ))}
        </box>
    </window>;
}

export default function DockApp(monitor: Gdk.Monitor) {
    if (option.dock.enabled === true) {
        return <Dock />;
    }
}

