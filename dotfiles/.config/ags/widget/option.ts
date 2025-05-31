import { Astal, Gtk, Gdk } from "astal/gtk3"
export default {
    pass: "1545",
    desktop: {
        filemanager: false,
        terminal: false,
        texteditor: false,
    },
    bar: {
      enabled: true,
      position: "top",
      valign: Gtk.Align.CENTER,
      halign: Gtk.Align.END,
    },
    osd: {
      position: "bottom"
    },
    dock: {
      enabled: false,
      exclusive: false,
      pinned_apps: [
      ],
    },
};
