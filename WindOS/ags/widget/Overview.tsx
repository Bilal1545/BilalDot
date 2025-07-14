import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable } from "astal"
import option from "./options.js"
import { execAsync } from "astal"

export default async function Overview() {
    const jsonStr = await execAsync("hyprctl clients -j")
    const clients = JSON.parse(jsonStr)

    console.log(clients.size)

    let workspaces = {}

    clients.forEach(client => {
        let ws = client.workspace.id
        if (!workspaces[ws]) workspaces[ws] = []
        workspaces[ws].push(client)
    })

    return <window
        name="overview"
        visible={false}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box className="Overview">
            <box>
                {Object.keys(workspaces).map(wsId =>
                    <box expand={false} fill={false} vertical className={"workspace"} key={wsId}>
                        <label css={"margin: 5px 10px;"} halign={Gtk.Align.START} label={wsId} />
                        {workspaces[wsId].map(win =>
                            <button css={`min-width: ${win.size[0] / 5}px;min-height: ${win.size[1] / 5}px;`} onClicked={() => {
                            execAsync(`hyprctl dispatch focuswindow address:${win.address}`)
                            App.get_window("overview")!.hide()}}>
                                <box vertical halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
                                    <icon css={`font-size: ${win.size[1] <= 300 ? win.size[1] / 5 : win.size[1] / 12}px;`} icon={win.initialTitle.toLowerCase().replace(/\s+/g, '-')} />
                                    <label visible={win.size[1] >= 300} label={win.initialTitle} />
                                </box>
                            </button>
                        )}
                    </box>
                )}
            </box>
        </box>
    </window>
}