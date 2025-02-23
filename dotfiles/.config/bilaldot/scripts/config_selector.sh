#!/bin/bash

CONFIG_DIR="$HOME/.config/hypr"

SELECTED_FILE=$(ls "$CONFIG_DIR" | rofi -dmenu -replace -i \
    -config "$HOME/.config/rofi/config-themes.rasi" \
    -no-show-icons -width 30 -p "Select Config File to Open:")

if [ -n "$SELECTED_FILE" ]; then
    ~/.config/bilaldot/scripts/terminal.sh -e micro "$CONFIG_DIR/$SELECTED_FILE"
else
    notify-send "Config Selector" "No valid file selected. Exiting."
fi

