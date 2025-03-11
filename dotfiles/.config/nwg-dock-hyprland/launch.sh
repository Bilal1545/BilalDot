if [ "$(cat ~/.config/bilaldot/settings/nwg-dock-hyprland.sh)" == "true" ]; then
glass=""
fullscreen=""
floating=""
auto_hide=""
size="-i $(cat ~/.config/bilaldot/settings/dock-size.sh)"
margin="-ml $(cat ~/.config/bilaldot/settings/dock-margin.sh) -mr $(cat ~/.config/bilaldot/settings/dock-margin.sh)"
margin_bt="-mb $(cat ~/.config/bilaldot/settings/dock-margin-bt.sh) -mt $(cat ~/.config/bilaldot/settings/dock-margin-bt.sh)"
launcher_position="$(cat ~/.config/bilaldot/settings/dock-launcher-position.sh)"
icons_position="$(cat ~/.config/bilaldot/settings/dock-icons-position.sh)"
dock_position="$(cat ~/.config/bilaldot/settings/dock-position.sh)"

if [ "$(cat ~/.config/bilaldot/settings/dock-float.sh)" == "true" ]; then
floating="-l overlay"
else
floating="-x"
fi

if [ "$(cat ~/.config/bilaldot/settings/dock-auto-hide.sh)" == "true" ]; then
auto_hide="-d -hd 0"
fi

if [ "$(cat ~/.config/bilaldot/settings/dock-fullscreen.sh)" == "true" ]; then
fullscreen="-f"
fi

if [ "$(cat ~/.config/bilaldot/settings/dock-glass.sh)" == "true" ]; then
glass="-s glass-style.css"
fi

nwg-dock-hyprland $auto_hide $margin $margin_bt $glass $fullscreen -a $icons_position $floating $size -lp $launcher_position -p $dock_position -c "$HOME/.config/bilaldot/scripts/launcher.sh -show drun"
fi
