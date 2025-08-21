import app from "ags/gtk4/app"
import style from "./style.scss"
import Sidebar from "./widget/Sidebar"
import Bar from "./widget/Bar"

app.start({
  requestHandler(request: string, res: (response: any) => void) {
    if (request == "say hi") {
      
    }
    res("unknown command")
  },
  css: style,
  main() {
    app.get_monitors().map(Bar)
    app.get_monitors().map(Sidebar)
  },
})
