import { App, Widget, Astal } from "astal/gtk3"
import Sidebar from "./widget/Sidebar.tsx"

App.start({
    css: "./style.css",
    main() {
        Sidebar();
    }
})
