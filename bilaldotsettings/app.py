#!/usr/bin/env python3
import gi
import os
import subprocess

gi.require_version("Gtk", "4.0")
gi.require_version("Adw", "1")
from gi.repository import Gtk, Adw

# Konfigürasyon dizini ayarlanıyor
CONFIG_DIR = os.path.expanduser("~/.config/bilaldot/settings/")
BORDER_SIZE_FILE = os.path.join(CONFIG_DIR, "border-size.conf")
BORDER_RADIUS_FILE = os.path.join(CONFIG_DIR, "border-radius.conf")
if not os.path.isdir(CONFIG_DIR):
    os.makedirs(CONFIG_DIR)

class BilalDotSettingsApp(Adw.Application):
    def __init__(self):
        super().__init__(application_id="com.bilaldot.settings")
        self.window = None

    def do_activate(self):
        if not self.window:
            self.window = Adw.ApplicationWindow(application=self)
            self.window.set_title("Settings")
            self.window.set_default_size(800, 600)

            # UI dosyasını yükle
            builder = Gtk.Builder()
            SYSTEM_PATH = os.path.join("/usr/share/bilaldot/settings.ui")
            LOCAL_PATH = "settings.ui"

            ui_path = LOCAL_PATH if os.path.exists(LOCAL_PATH) else SYSTEM_PATH

            builder.add_from_file(ui_path)

            self.dialog = builder.get_object("dialog")

            #Combos
            self.panel_theme_combo = builder.get_object("panel_theme_combo")
            self.layout_combo = builder.get_object("layout_combo")
            self.launcher_combo = builder.get_object("launcher_combo")
            self.volume_combo = builder.get_object("volume_combo")
            self.volume_orientation_combo = builder.get_object("volume_orientation_combo")
            self.volume_position_combo = builder.get_object("volume_position_combo")
            #Buttons
            self.config_button = builder.get_object("run_panel_configure_button")
            self.config_waybar_button = builder.get_object("run_waybar_configure_button")
            self.float_toggle_button = builder.get_object("run_floating_toggle_button")
            self.displays_button = builder.get_object("run_displays_button")
            #Inputs
            self.terminal = builder.get_object("terminal")
            self.fm = builder.get_object("fm")
            self.browser = builder.get_object("browser")
            #Switch
            self.blur_switch = builder.get_object("blur_switch")
            self.xray_switch = builder.get_object("xray_switch")
            self.panel_switch = builder.get_object("panel_switch")
            self.light_switch = builder.get_object("light_theme_switch")
            self.no_border_float_switch = builder.get_object("no_border_float_switch")
            self.sunset_switch = builder.get_object("sunset_switch")
            self.dim_switch = builder.get_object("dim_switch")
            self.welcome_switch = builder.get_object("welcome_switch")
            self.waybar_switch = builder.get_object("waybar_switch")
            #Adjustments
            self.border_size_adj = builder.get_object("border_size_adjustment")
            self.blur_size_adj = builder.get_object("blur_size_adjustment")
            self.inactive_opacity_adj = builder.get_object("inactive_opacity_adjustment")
            self.active_opacity_adj = builder.get_object("active_opacity_adjustment")
            self.blur_passes_adj = builder.get_object("blur_passes_adjustment")
            self.border_radius_adj = builder.get_object("border_radius_adjustment")
            self.gaps_in_adj = builder.get_object("gaps_in_adjustment")
            self.gaps_out_adj = builder.get_object("gaps_out_adjustment")
            self.sunset_adj = builder.get_object("sunset_adjustment")
            self.dim_strength_adj = builder.get_object("dim_strength_adjustment")
            self.dim_duration_adj = builder.get_object("dim_duration_adjustment")
            # DOCK
            self.dock_switch = builder.get_object("dock_switch")
            self.dock_glass_switch = builder.get_object("dock_glass_switch")
            self.dock_float_switch = builder.get_object("dock_float_switch")
            self.dock_full_switch = builder.get_object("dock_full_switch")
            self.dock_hide_switch = builder.get_object("dock_hide_switch")
            self.dock_pos_combo = builder.get_object("dock_pos_combo")
            self.dock_icopos_combo = builder.get_object("dock_icopos_combo")
            self.dock_launcher_pos_combo = builder.get_object("dock_launcher_pos_combo")
            self.dock_size_adj = builder.get_object("dock_size_adjustment")
            self.dock_margin_adj = builder.get_object("dock_margin_adjustment")
            self.dock_margin_bt_adj = builder.get_object("dock_margin_bt_adjustment")

            self.load_preferences()

            # DOCK
            self.dock_switch.connect("notify::active", self.save_preferences)
            self.dock_glass_switch.connect("notify::active", self.save_preferences)
            self.dock_float_switch.connect("notify::active", self.save_preferences)
            self.dock_full_switch.connect("notify::active", self.save_preferences)
            self.dock_hide_switch.connect("notify::active", self.save_preferences)
            self.dock_pos_combo.connect("notify::selected", self.save_preferences)
            self.dock_icopos_combo.connect("notify::selected", self.save_preferences)
            self.dock_launcher_pos_combo.connect("notify::selected", self.save_preferences)
            self.dock_size_adj.connect("value-changed", self.save_preferences)
            self.dock_margin_adj.connect("value-changed", self.save_preferences)
            self.dock_margin_bt_adj.connect("value-changed", self.save_preferences)
            #Switch
            self.welcome_switch.connect("notify::active", self.save_preferences)
            self.blur_switch.connect("notify::active", self.save_preferences)
            self.xray_switch.connect("notify::active", self.save_preferences)
            self.waybar_switch.connect("notify::active", self.save_preferences)
            self.no_border_float_switch.connect("notify::active", self.save_preferences)
            self.panel_switch.connect("notify::active", self.save_preferences)
            self.light_switch.connect("notify::active", self.save_preferences)
            self.sunset_switch.connect("notify::active", self.save_preferences)
            self.dim_switch.connect("notify::active", self.save_preferences)
            #Inputs
            self.terminal.connect("changed", self.save_preferences)
            self.fm.connect("changed", self.save_preferences)
            self.browser.connect("changed", self.save_preferences)
            # Buttons
            self.config_button.connect("activated", self.execute_panel_config)
            self.config_waybar_button.connect("activated", self.execute_waybar_config)
            self.float_toggle_button.connect("activated", self.execute_float_toggle)
            self.displays_button.connect("activated", self.execute_displays)
            #Combos
            self.panel_theme_combo.connect("notify::selected", self.save_preferences)
            self.layout_combo.connect("notify::selected", self.save_preferences)
            self.launcher_combo.connect("notify::selected", self.save_preferences)
            self.volume_combo.connect("notify::selected", self.save_preferences)
            self.volume_orientation_combo.connect("notify::selected", self.save_preferences)
            self.volume_position_combo.connect("notify::selected", self.save_preferences)
            # Adjustments
            self.border_size_adj.connect("value-changed", self.save_preferences)
            self.gaps_in_adj.connect("value-changed", self.save_preferences)
            self.gaps_out_adj.connect("value-changed", self.save_preferences)
            self.inactive_opacity_adj.connect("value-changed", self.save_preferences)
            self.active_opacity_adj.connect("value-changed", self.save_preferences)
            self.border_radius_adj.connect("value-changed", self.save_preferences)
            self.blur_size_adj.connect("value-changed", self.save_preferences)
            self.blur_passes_adj.connect("value-changed", self.save_preferences)
            self.sunset_adj.connect("value-changed", self.save_preferences)
            self.dim_strength_adj.connect("value-changed", self.save_preferences)
            self.dim_duration_adj.connect("value-changed", self.save_preferences)

            self.dialog.connect("close-request", self.on_close_request)
            self.dialog.present()
            
    def on_close_request(self, window, *args):
        # Uygulamayı sonlandır
        self.quit()
        return False
        

    def load_preferences(self):
        """Ayar dosyalarından değerleri okuyup ilgili UI öğelerine uygular."""

        try:
            color_scheme = subprocess.check_output(
                ["gsettings", "get", "org.gnome.desktop.interface", "color-scheme"],
                universal_newlines=True
            ).strip()
            
            # Eğer renk şeması 'prefer-light' ise, switch'i aktif yap
            if color_scheme == "'prefer-light'":
                self.light_switch.set_active(True)
            else:
                self.light_switch.set_active(False)

        except subprocess.CalledProcessError:
            print("Renk şeması alınamadı.")

        terminal_file = os.path.join(CONFIG_DIR, "terminal.sh")
        try:
            with open(terminal_file) as f:
                terminal = f.read().strip()  # Dosyayı oku ve baştaki/sondaki boşlukları temizle
            if self.terminal:  # input_entry'yi doğru bir şekilde al
                self.terminal.set_text(terminal)  # Entry'ye yükle
        except Exception as e:
            pass

        fm_file = os.path.join(CONFIG_DIR, "file-manager.sh")
        try:
            with open(fm_file) as f:
                fm = f.read().strip()  # Dosyayı oku ve baştaki/sondaki boşlukları temizle
            if self.fm:  # input_entry'yi doğru bir şekilde al
                self.fm.set_text(fm)  # Entry'ye yükle
        except Exception as e:
            pass
            
        browser_file = os.path.join(CONFIG_DIR, "browser.sh")
        try:
            with open(browser_file) as f:
                browser = f.read().strip()  # Dosyayı oku ve baştaki/sondaki boşlukları temizle
            if self.browser:  # input_entry'yi doğru bir şekilde al
                self.browser.set_text(browser)  # Entry'ye yükle
        except Exception as e:
            pass


        try:
            with open(os.path.join(CONFIG_DIR, "layout.conf"), "r") as f:
                content = f.read().strip()  # Dosyayı oku
                if content.startswith("$layout = "):  # Formatı kontrol et
                    layout = content.split("=")[1].strip()  # "=" işaretinden sonraki kısmı al
                    if self.layout_combo:
                        model = self.layout_combo.get_model()
                        for i in range(model.get_n_items()):
                            if model.get_string(i) == layout:  # Modeldeki değerle eşleşen satırı bul
                                self.layout_combo.set_selected(i)  # Seçili hale getir
                                break
        except Exception:
                pass

        try:
            with open(os.path.join(CONFIG_DIR, "launcher.sh"), "r") as f:
                content = f.read().strip()  # Dosyayı oku
                model = self.launcher_combo.get_model()  # Kombinasyon kutusunun modelini al
                for i in range(model.get_n_items()):
                    if model.get_string(i) == content:  # Eşleşen öğeyi bul
                        self.launcher_combo.set_selected(i)  # Seçili hale getir
                        break
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "volume-notification-theme.sh"), "r") as f:
                content = f.read().strip()  # Dosyayı oku
                model = self.volume_combo.get_model()  # Kombinasyon kutusunun modelini al
                for i in range(model.get_n_items()):
                    if model.get_string(i) == content:  # Eşleşen öğeyi bul
                        self.volume_combo.set_selected(i)  # Seçili hale getir
                        break
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "volume-notification-position.sh"), "r") as f:
                content = f.read().strip()  # Dosyayı oku
                model = self.volume_position_combo.get_model()  # Kombinasyon kutusunun modelini al
                for i in range(model.get_n_items()):
                    if model.get_string(i) == content:  # Eşleşen öğeyi bul
                        self.volume_position_combo.set_selected(i)  # Seçili hale getir
                        break
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "volume-notification-orientation.sh"), "r") as f:
                content = f.read().strip()  # Dosyayı oku
                model = self.volume_orientation_combo.get_model()  # Kombinasyon kutusunun modelini al
                for i in range(model.get_n_items()):
                    if model.get_string(i) == content:  # Eşleşen öğeyi bul
                        self.volume_orientation_combo.set_selected(i)  # Seçili hale getir
                        break
        except Exception:
            pass

        no_border_float_file = os.path.join(CONFIG_DIR, "no_border_float.conf")
        if os.path.isfile(no_border_float_file):
            try:
                with open(no_border_float_file, "r") as f:
                    no_border_float_switch_state = f.read().strip().lower()
                if self.no_border_float_switch:
                    self.no_border_float_switch.set_active(no_border_float_switch_state == "windowrulev2 = bordersize 0, floating:1")
            except Exception:
                pass

        dim_file = os.path.join(CONFIG_DIR, "hyprdim.sh")
        if os.path.isfile(dim_file):
            try:
                with open(dim_file, "r") as f:
                    dim_state = f.read().strip().lower()
                if self.dim_switch:
                    self.dim_switch.set_active(dim_state == "true")
            except Exception:
                pass
        
        try:
            with open(os.path.join(CONFIG_DIR, "hyprdim-strength.sh"), "r") as f:
                dim_strength_value = float(f.read().strip()) * 10
                self.dim_strength_adj.set_value(round(dim_strength_value))
        except Exception as e:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "hyprdim-duration.sh"), "r") as f:
                dim_duration_value = float(f.read().strip())

                self.dim_duration_adj.set_value(round(dim_duration_value))
        except Exception as e:
            pass

        sunset_file = os.path.join(CONFIG_DIR, "sunset.sh")
        if os.path.isfile(sunset_file):
            try:
                with open(sunset_file, "r") as f:
                    sunset_state = f.read().strip().lower()
                if self.sunset_switch:
                    self.sunset_switch.set_active(sunset_state == "true")
            except Exception:
                pass
                
        welcome_file = os.path.join(CONFIG_DIR, "welcome.sh")
        if os.path.isfile(welcome_file):
            try:
                with open(welcome_file, "r") as f:
                    welcome_state = f.read().strip().lower()
                if self.welcome_switch:
                    self.welcome_switch.set_active(welcome_state == "true")
            except Exception:
                pass
        
        try:
            with open(os.path.join(CONFIG_DIR, "sunset-value.sh")) as f:
                value = f.read().strip()
                if value:  # Eğer boş değilse
                    self.sunset_adj.set_value(float(value))
        except Exception as e:
            pass

        # DOCK

        dock_file = os.path.join(CONFIG_DIR, "nwg-dock-hyprland.sh")
        if os.path.isfile(dock_file):
            try:
                with open(dock_file, "r") as f:
                    dock_state = f.read().strip().lower()
                if self.dock_switch:
                    self.dock_switch.set_active(dock_state == "true")
            except Exception:
                pass

        dock_float_file = os.path.join(CONFIG_DIR, "dock-floating.sh")
        if os.path.isfile(dock_float_file):
            try:
                with open(dock_float_file, "r") as f:
                    dock_float_state = f.read().strip().lower()
                if self.dock_float_switch:
                    self.dock_float_switch.set_active(dock_float_state == "true")
            except Exception:
                pass

        dock_glass_file = os.path.join(CONFIG_DIR, "dock-glass.sh")
        if os.path.isfile(dock_glass_file):
            try:
                with open(dock_glass_file, "r") as f:
                    dock_glass_state = f.read().strip().lower()
                if self.dock_glass_switch:
                    self.dock_glass_switch.set_active(dock_glass_state == "true")
            except Exception:
                pass
            
        dock_float_file = os.path.join(CONFIG_DIR, "dock-float.sh")
        if os.path.isfile(dock_float_file):
            try:
                with open(dock_float_file, "r") as f:
                    dock_float_state = f.read().strip().lower()
                if self.dock_float_switch:
                    self.dock_float_switch.set_active(dock_float_state == "true")
            except Exception:
                pass

        dock_full_file = os.path.join(CONFIG_DIR, "dock-fullscreen.sh")
        if os.path.isfile(dock_float_file):
            try:
                with open(dock_float_file, "r") as f:
                    dock_float_state = f.read().strip().lower()
                if self.dock_float_switch:
                    self.dock_float_switch.set_active(dock_float_state == "true")
            except Exception:
                pass

        dock_glass_auto_hide_file = os.path.join(CONFIG_DIR, "dock-glass-auto-hide.sh")
        if os.path.isfile(dock_glass_auto_hide_file):
            try:
                with open(dock_glass_auto_hide_file, "r") as f:
                    dock_glass_auto_hide_state = f.read().strip().lower()
                if self.dock_glass_auto_hide_switch:
                    self.dock_glass_auto_hide_switch.set_active(dock_glass_auto_hide_state == "true")
            except Exception:
                pass

        try:
            with open(os.path.join(CONFIG_DIR, "dock-position.sh"), "r") as f:
                content = f.read().strip()  # Dosyayı oku
                model = self.dock_pos_combo.get_model()  # Kombinasyon kutusunun modelini al
                for i in range(model.get_n_items()):
                    if model.get_string(i) == content:  # Eşleşen öğeyi bul
                        self.dock_pos_combo.set_selected(i)  # Seçili hale getir
                        break
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "dock-icons-position.sh"), "r") as f:
                content = f.read().strip()  # Dosyayı oku
                model = self.dock_icopos_combo.get_model()  # Kombinasyon kutusunun modelini al
                for i in range(model.get_n_items()):
                    if model.get_string(i) == content:  # Eşleşen öğeyi bul
                        self.dock_icopos_combo.set_selected(i)  # Seçili hale getir
                        break
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "dock-launcher-position.sh"), "r") as f:
                content = f.read().strip()  # Dosyayı oku
                model = self.dock_launcher_pos_combo.get_model()  # Kombinasyon kutusunun modelini al
                for i in range(model.get_n_items()):
                    if model.get_string(i) == content:  # Eşleşen öğeyi bul
                        self.dock_launcher_pos_combo.set_selected(i)  # Seçili hale getir
                        break
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "dock-size.sh")) as f:
                value = f.read().strip()
                if value:  # Eğer boş değilse
                    self.dock_size_adj.set_value(float(value))
        except Exception as e:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "dock-margin.sh")) as f:
                value = f.read().strip()
                if value:  # Eğer boş değilse
                    self.dock_margin_adj.set_value(float(value))
        except Exception as e:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "dock-margin-bt.sh")) as f:
                value = f.read().strip()
                if value:  # Eğer boş değilse
                    self.dock_margin_bt_adj.set_value(float(value))
        except Exception as e:
            pass


        waybar_file = os.path.join(CONFIG_DIR, "waybar.sh")
        if os.path.isfile(waybar_file):
            try:
                with open(waybar_file, "r") as f:
                    waybar_state = f.read().strip().lower()
                if self.waybar_switch:
                    self.waybar_switch.set_active(waybar_state == "true")
            except Exception:
                pass

        panel_file = os.path.join(CONFIG_DIR, "nwg-panel.sh")
        if os.path.isfile(panel_file):
            try:
                with open(panel_file, "r") as f:
                    panel_state = f.read().strip().lower()
                if self.panel_switch:
                    self.panel_switch.set_active(panel_state == "true")
            except Exception:
                pass

        try:
            with open(os.path.join(CONFIG_DIR, "nwg-theme.sh"), "r") as f:
                content = f.read().strip() 
                model = self.nwg_panel_theme_combo.get_model()  # Kombinasyon kutusunun modelini al
                for i in range(model.get_n_items()):
                    if model.get_string(i) == content:  # Eşleşen öğeyi bul
                        self.nwg_panel_theme_combo.set_selected(i)  # Seçili hale getir
                        break
        except Exception:
            pass

        blur_file = os.path.join(CONFIG_DIR, "blur.conf")
        if os.path.isfile(blur_file):
            try:
                with open(blur_file, "r") as f:
                    blur_state = f.read().strip().lower()
                if self.blur_switch:
                    self.blur_switch.set_active(blur_state == "$blur = 1")
            except Exception:
                pass

        xray_file = os.path.join(CONFIG_DIR, "xray.conf")
        if os.path.isfile(xray_file):
            try:
                with open(xray_file, "r") as f:
                    blur_state = f.read().strip().lower()
                if self.xray_switch:
                    self.xray_switch.set_active(xray_state == "$xray = 1")
            except Exception:
                pass

            try:
                with open(os.path.join(CONFIG_DIR, "gaps-in.conf")) as f:
                    lines = f.readlines()
                    for line in lines:
                        if line.startswith("$gaps-in"):
                            value = int(line.split("=")[1].strip())
                            self.gaps_in_adj.set_value(value)
                            break
            except Exception:
                pass

            try:
                with open(os.path.join(CONFIG_DIR, "gaps-out.conf")) as f:
                    lines = f.readlines()
                    for line in lines:
                        if line.startswith("$gaps-out"):
                            value = int(line.split("=")[1].strip())
                            self.gaps_out_adj.set_value(value)
                            break
            except Exception:
                pass

        if os.path.exists(BORDER_SIZE_FILE):
            try:
                with open(BORDER_SIZE_FILE, "r") as f:
                    lines = f.readlines()
                    for line in lines:
                        if line.startswith("$border-size"):
                            value = int(line.split("=")[1].strip())
                            self.border_size_adj.set_value(value)
                            break
            except Exception:
                pass

        try:
            with open(os.path.join(CONFIG_DIR, "blur-size.conf"), "r") as f:
                lines = f.readlines()
                for line in lines:
                    if line.startswith("$blur-size"):
                        value = int(line.split("=")[1].strip())
                        self.blur_size_adj.set_value(value)
                        break
        except Exception:
            self.blur_size_adj.set_value(3)

        try:
            with open(os.path.join(CONFIG_DIR, "blur-passes.conf"), "r") as f:
                lines = f.readlines()
                for line in lines:
                    if line.startswith("$blur-passes"):
                        value = int(line.split("=")[1].strip())
                        self.blur_passes_adj.set_value(value)
                        break
        except Exception:
            self.blur_passes_adj.set_value(2)

        inactive_opacity_file = os.path.join(CONFIG_DIR, "inactive_opacity.conf")
        try:
            with open(inactive_opacity_file, "r") as f:
                lines = f.readlines()
                for line in lines:
                    if line.startswith("$inactive_opacity"):
                        # Değeri 10 ile çarp ve ardından yuvarla
                        inactive_opacity_value = float(line.split("=")[1].strip()) * 10
                        self.inactive_opacity_adj.set_value(round(inactive_opacity_value))
                        break
        except Exception as e:
            pass

        active_opacity_file = os.path.join(CONFIG_DIR, "active_opacity.conf")
        try:
            with open(active_opacity_file, "r") as f:
                lines = f.readlines()
                for line in lines:
                    if line.startswith("$active_opacity"):
                        # Değeri 10 ile çarp ve ardından yuvarla
                        active_opacity_value = float(line.split("=")[1].strip()) * 10
                        self.active_opacity_adj.set_value(round(active_opacity_value))
                        break
        except Exception as e:
            pass


        if os.path.exists(BORDER_RADIUS_FILE):
            try:
                with open(BORDER_RADIUS_FILE, "r") as f:
                    lines = f.readlines()
                    for line in lines:
                        if line.startswith("$border-radius"):
                            value = int(line.split("=")[1].strip())
                            self.border_radius_adj.set_value(value)
                            break
            except Exception:
                pass

    def save_preferences(self, *args):
        """UI öğelerindeki değişiklikleri ayar dosyalarına kaydeder."""
        inactive_opacity_file = os.path.join(CONFIG_DIR, "inactive_opacity.conf")
        active_opacity_file = os.path.join(CONFIG_DIR, "active_opacity.conf")

        try:
            if self.inactive_opacity_adj:
                inactive_opacity_value = round(self.inactive_opacity_adj.get_value() / 10, 1)
                with open(inactive_opacity_file, "w") as f:
                    f.write(f"$inactive_opacity = {inactive_opacity_value}\n")
        except Exception as e:
            f.write(f"$inactive_opacity = 0.9")

        try:
            if self.active_opacity_adj:
                active_opacity_value = round(self.active_opacity_adj.get_value() / 10, 1)
                with open(active_opacity_file, "w") as f:
                    f.write(f"$active_opacity = {active_opacity_value}\n")
        except Exception as e:
            f.write(f"$inactive_opacity = 1.0")

        no_border_float_file = os.path.join(CONFIG_DIR, "no_border_float.conf")
        try:
            with open(no_border_float_file, "w") as f:
                if self.no_border_float_switch.get_active():
                    f.write("windowrulev2 = bordersize 0, floating:1")
                else:
                    f.write("")  # Dosyayı boş bırak
        except Exception:
            pass

        layout_selected = self.layout_combo.get_selected()
        if layout_selected != -1:
            model = self.layout_combo.get_model()
            selected_layout = model.get_string(layout_selected)
            try:
                with open(os.path.join(CONFIG_DIR, "layout.conf"), "w") as f:
                    f.write(f"$layout = {selected_layout}")
            except Exception:
                pass

        launcher_selected = self.launcher_combo.get_selected()
        if launcher_selected != -1:
            model = self.launcher_combo.get_model()
            selected_launcher = model.get_string(launcher_selected)
            try:
                with open(os.path.join(CONFIG_DIR, "launcher.sh"), "w") as f:
                    f.write(f"{selected_launcher}")
            except Exception:
                pass

        volume_selected = self.volume_combo.get_selected()
        if volume_selected != -1:
            model = self.volume_combo.get_model()
            selected_volume = model.get_string(volume_selected)
            try:
                with open(os.path.join(CONFIG_DIR, "volume-notification-theme.sh"), "w") as f:
                    f.write(f"{selected_volume}")
            except Exception:
                pass

        volume_position_selected = self.volume_position_combo.get_selected()
        if volume_position_selected != -1:
            model = self.volume_position_combo.get_model()
            selected_volume_position = model.get_string(volume_position_selected)
            try:
                with open(os.path.join(CONFIG_DIR, "volume-notification-position.sh"), "w") as f:
                    f.write(f"{selected_volume_position}")
            except Exception:
                pass

        volume_orientation_selected = self.volume_orientation_combo.get_selected()
        if volume_selected != -1:
            model = self.volume_orientation_combo.get_model()
            selected_volume_orientation = model.get_string(volume_orientation_selected)
            try:
                with open(os.path.join(CONFIG_DIR, "volume-notification-orientation.sh"), "w") as f:
                    f.write(f"{selected_volume_orientation}")
            except Exception:
                pass

        waybar_file = os.path.join(CONFIG_DIR, "waybar.sh")
        try:
            with open(waybar_file, "w") as f:
                f.write(str(self.waybar_switch.get_active()).lower())
        except Exception:
            pass

        welcome_file = os.path.join(CONFIG_DIR, "welcome.sh")
        try:
            with open(welcome_file, "w") as f:
                f.write(str(self.welcome_switch.get_active()).lower())
        except Exception:
            pass

        dim_file = os.path.join(CONFIG_DIR, "hyprdim.sh")
        try:
            with open(dim_file, "w") as f:
                f.write(str(self.dim_switch.get_active()).lower())
        except Exception:
            pass
            

        try:
            with open(os.path.join(CONFIG_DIR, "hyprdim-duraiton.sh"), "w") as f:
                f.write(f"{int(self.dim_adj.get_value())}")
        except Exception:
            pass

        if self.light_switch.get_active() == True:
            os.system("gsettings set org.gnome.desktop.interface color-scheme 'prefer-light' && gsettings set org.gnome.desktop.interface gtk-theme 'Adwaita'")

        if self.light_switch.get_active() == False:
            os.system("gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark' && gsettings set org.gnome.desktop.interface gtk-theme 'Adwaita-dark'")

        sunset_file = os.path.join(CONFIG_DIR, "sunset.sh")
        try:
            with open(sunset_file, "w") as f:
                f.write(str(self.sunset_switch.get_active()).lower())
        except Exception:
            pass
            

        try:
            with open(os.path.join(CONFIG_DIR, "sunset-value.sh"), "w") as f:
                f.write(f"{int(self.sunset_adj.get_value())}")
        except Exception:
            pass

        # DOCK

        dock_file = os.path.join(CONFIG_DIR, "nwg-dock-hyprland.sh")
        try:
            with open(dock_file, "w") as f:
                f.write(str(self.dock_switch.get_active()).lower())
        except Exception:
            pass
        
        dock_glass_file = os.path.join(CONFIG_DIR, "dock-glass.sh")
        try:
            with open(dock_glass_file, "w") as f:
                f.write(str(self.dock_glass_switch.get_active()).lower())
        except Exception:
            pass

        dock_float_file = os.path.join(CONFIG_DIR, "dock-float.sh")
        try:
            with open(dock_float_file, "w") as f:
                f.write(str(self.dock_float_switch.get_active()).lower())
        except Exception:
            pass

        dock_full_file = os.path.join(CONFIG_DIR, "dock-fullscreen.sh")
        try:
            with open(dock_full_file, "w") as f:
                f.write(str(self.dock_full_switch.get_active()).lower())
        except Exception:
            pass

        dock_auto_hide_file = os.path.join(CONFIG_DIR, "dock-auto-hide.sh")
        try:
            with open(dock_auto_hide_file, "w") as f:
                f.write(str(self.dock_hide_switch.get_active()).lower())
        except Exception:
            pass

        dock_pos_selected = self.dock_pos_combo.get_selected()
        if dock_pos_selected != -1:
            model = self.dock_pos_combo.get_model()
            selected_dock_pos = model.get_string(dock_pos_selected)
            try:
                with open(os.path.join(CONFIG_DIR, "dock-position.sh"), "w") as f:
                    f.write(f"{selected_dock_pos}")
            except Exception:
                pass

        dock_icopos_selected = self.dock_icopos_combo.get_selected()
        if dock_icopos_selected != -1:
            model = self.dock_icopos_combo.get_model()
            selected_dock_icopos = model.get_string(dock_icopos_selected)
            try:
                with open(os.path.join(CONFIG_DIR, "dock-icons-position.sh"), "w") as f:
                    f.write(f"{selected_dock_icopos}")
            except Exception:
                pass

        dock_launcher_pos_selected = self.dock_launcher_pos_combo.get_selected()
        if dock_launcher_pos_selected != -1:
            model = self.dock_launcher_pos_combo.get_model()
            selected_dock_launcher_pos = model.get_string(dock_launcher_pos_selected)
            try:
                with open(os.path.join(CONFIG_DIR, "dock-launcher-position.sh"), "w") as f:
                    f.write(f"{selected_dock_launcher_pos}")
            except Exception:
                pass

        try:
            with open(os.path.join(CONFIG_DIR, "dock-size.sh"), "w") as f:
                f.write(f"{int(self.dock_size_adj.get_value())}")
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "dock-margin.sh"), "w") as f:
                f.write(f"{int(self.dock_margin_adj.get_value())}")
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "dock-margin-bt.sh"), "w") as f:
                f.write(f"{int(self.dock_margin_bt_adj.get_value())}")
        except Exception:
            pass

        panel_file = os.path.join(CONFIG_DIR, "nwg-panel.sh")
        try:
            with open(panel_file, "w") as f:
                f.write(str(self.panel_switch.get_active()).lower())
        except Exception:
            pass

        blur_file = os.path.join(CONFIG_DIR, "blur.conf")
        try:
            with open(blur_file, "w") as f:
                f.write(f"$blur = {int(self.blur_switch.get_active())}")
        except Exception:
            pass

        xray_file = os.path.join(CONFIG_DIR, "xray.conf")
        try:
            with open(xray_file, "w") as f:
                f.write(f"$xray = {int(self.xray_switch.get_active())}")
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "terminal.sh"), "w") as f:
                f.write(str(self.terminal.get_text()))
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "file-manager.sh"), "w") as f:
                f.write(str(self.fm.get_text()))
        except Exception:
            pass
            
        try:
            with open(os.path.join(CONFIG_DIR, "browser.sh"), "w") as f:
                f.write(str(self.browser.get_text()))
        except Exception:
            pass
        
        panel_theme_combo_selected = self.panel_theme_combo.get_selected()
        if panel_theme_combo_selected != -1:
            model = self.panel_theme_combo.get_model()
            selected_panel_theme = model.get_string(panel_theme_combo_selected)
            try:
                with open(os.path.join(CONFIG_DIR, "nwg-theme.sh"), "w") as f:
                    f.write(f"{selected_panel_theme}")
            except Exception:
                pass

        try:
            with open(BORDER_SIZE_FILE, "w") as f:
                f.write(f"$border-size = {int(self.border_size_adj.get_value())}")
        except Exception:
            pass

        try:
            with open(BORDER_RADIUS_FILE, "w") as f:
                f.write(f"$border-radius = {int(self.border_radius_adj.get_value())}")
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "gaps-in.conf"), "w") as f:
                f.write(f"$gaps-in= {int(self.gaps_in_adj.get_value())}")
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "gaps-out.conf"), "w") as f:
                f.write(f"$gaps-out = {int(self.gaps_out_adj.get_value())}")
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "blur-size.conf"), "w") as f:
                f.write(f"$blur-size = {int(self.blur_size_adj.get_value())}")
        except Exception:
            pass

        try:
            with open(os.path.join(CONFIG_DIR, "blur-passes.conf"), "w") as f:
                f.write(f"$blupasses = {int(self.blur_passes_adj.get_value())}")
        except Exception:
            pass

    def execute_panel_config(self, widget):
        try:
            subprocess.run(["nwg-panel-config"], check=True)
        except subprocess.CalledProcessError:
            pass

    def execute_displays(self, widget):
        try:
            subprocess.run(["nwg-displays"], check=True)
        except subprocess.CalledProcessError:
            pass

    def execute_waybar_config(self, widget):
        try:
            subprocess.run([os.path.expanduser("~/.config/waybar/themeswitcher.sh")], check=True)
        except subprocess.CalledProcessError:
            pass

    def execute_float_toggle(self, widget):
        try:
            subprocess.run([os.path.expanduser("~/.config/bilaldot/scripts/allfloat_toggle.sh")], check=True)
        except subprocess.CalledProcessError:
            pass

if __name__ == '__main__':
    try:
        app = BilalDotSettingsApp()
        app.run(None)
    except KeyboardInterrupt:
        pass