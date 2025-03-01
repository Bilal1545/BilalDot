#!/bin/bash
reload_script="$HOME/.config/bilaldot/scripts/reload.sh"
# Rofi ile tema seçimi
CHOICE=$(printf "Dark\nLight\nGlass" | rofi -dmenu -replace -i \
    -config "$HOME/.config/rofi/config-themes.rasi" \
    -no-show-icons -width 30 -p "Select Theme:" -format i)

# Seçime göre işlem yap
if [[ "$CHOICE" == "0" ]]; then
    echo '@import url("../../waybar/themes/dark/style.css");' > ~/.config/bilaldot/settings/waybar-theme.css
    $reload_script
    notify-send "Theme Switcher" "Theme Changed to Dark Succesfully!"
elif [[ "$CHOICE" == "1" ]]; then
    echo '@import url("../../waybar/themes/light/style.css");' > ~/.config/bilaldot/settings/waybar-theme.css
    $reload_script
    notify-send "Theme Switcher" "Theme Changed to Light Succesfully!"
elif [[ "$CHOICE" == "2" ]]; then
    echo '@import url("../../waybar/themes/glass/style.css");' > ~/.config/bilaldot/settings/waybar-theme.css
    $reload_script
    notify-send "Theme Switcher" "Theme Changed to Light Succesfully!"
fi

