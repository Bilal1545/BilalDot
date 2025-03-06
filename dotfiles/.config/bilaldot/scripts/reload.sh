#!/bin/bash

# Önce çalışan süreçleri kapat
pkill -f waybar 
pkill -f nwg-panel 
pkill -f nwg-dock-hyprland  
pkill -f hyprsunset 
pkill -f ags
pkill -f swaync 
pkill -f avizo
pkill -f syshud
pkill -f hyprdim 
swaync &

# nwg-dock başlat
$HOME/.config/nwg-dock-hyprland/launch.sh &

# waybar başlat
$HOME/.config/waybar/waybar.sh &


# Eğer sunset modu açıksa hyprsunset başlat
if [ "$(cat ~/.config/bilaldot/settings/sunset.sh)" == "true" ]; then
    hyprsunset -t "$(cat ~/.config/bilaldot/settings/sunset-value.sh)" &
fi

if [ "$(cat ~/.config/bilaldot/settings/volume-notification-theme.sh)" == "apple" ]; then
    avizo-service
else
syshud
fi

if [ "$(cat ~/.config/bilaldot/settings/hyprdim.sh)" == "true" ]; then
dim_strength=$(cat ~/.config/bilaldot/settings/hyprdim-strength.sh)
hyprdim -s $dim_strength &
fi

# ags başlat
ags run &

hyprswitch init --custom-css ~/.config/hypr/hyprswitch.css &

# nwg-panel başlat
$HOME/.config/nwg-panel/launch.sh &

