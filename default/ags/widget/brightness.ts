import GObject, { register, property } from "astal/gobject"
import { monitorFile, readFileAsync } from "astal/file"
import { exec, execAsync } from "astal/process"

const get = (args: string) => Number(exec(`brightnessctl ${args}`))
const screen = exec(`bash -c "ls -w1 /sys/class/backlight | head -1"`)

@register({ GTypeName: "Brightness_osd" })
export default class Brightness_osd extends GObject.Object {
    static instance: Brightness_osd
    static get_default() {
        if (!this.instance)
            this.instance = new Brightness_osd()

        return this.instance
    }

    #screenMax = get("max")
    #screen = get("get") / (get("max") || 1)

    @property(Number)
    get screen() { return this.#screen }

    set screen(percent) {
        if (percent < 0)
            percent = 0

        if (percent > 1)
            percent = 1

        execAsync(`brightnessctl set ${Math.floor(percent * 100)}% -q`).then(() => {
            this.#screen = percent
            this.notify("screen")
        })
    }

    constructor() {
        super()
        monitorFile(`/sys/class/backlight/${screen}/brightness`, async f => {
            const v = await readFileAsync(f)
            this.#screen = Number(v) / this.#screenMax
            this.notify("screen")
        })
    }
}
