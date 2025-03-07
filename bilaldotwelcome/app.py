#!/usr/bin/env python3
import gi
import os
import subprocess
gi.require_version("Gtk", "4.0")
gi.require_version("Adw", "1")
from gi.repository import Gtk, Adw

class BilalDotWelcomeApp(Adw.Application):
    def __init__(self):
        super().__init__(application_id="com.bilaldot.welcome")
        self.window = None

    def do_activate(self):
        if not self.window:
            self.window = Adw.ApplicationWindow(application=self)
            self.window.set_title("Welcome")
            self.window.set_default_size(800, 600)

            # UI dosyasını yükle
            builder = Gtk.Builder()
            SYSTEM_PATH = os.path.join("/usr/share/bilaldot/welcome.ui")
            LOCAL_PATH = "welcome.ui"

            ui_path = LOCAL_PATH if os.path.exists(LOCAL_PATH) else SYSTEM_PATH

            builder.add_from_file(ui_path)

            self.window = builder.get_object("window")
            self.keybindings = builder.get_object("keybindings_button")
            self.window.connect("close-request", self.on_close_request)
            self.keybindings.connect("clicked", self.execute_keybindings)
            self.window.present()

    def on_close_request(self, window, *args):
        # Uygulamayı sonlandır
        self.quit()
        return False

    def execute_keybindings(self, widget):
        try:
            subprocess.run([os.path.expanduser("~/.config/bilaldot/scripts/keybindings.sh")], check=True)
        except subprocess.CalledProcessError:
            pass

if __name__ == '__main__':
    try:
        app = BilalDotWelcomeApp()
        app.run(None)
    except KeyboardInterrupt:
        pass