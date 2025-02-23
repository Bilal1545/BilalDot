#!/bin/sh

LAUNCHER_SCRIPT="$HOME/.config/bilaldot/settings/launcher.sh"

# Ek parametreleri al
PARAMS="$@"

# Dosya içeriğini kontrol et
if grep -q "rofi" "$LAUNCHER_SCRIPT"; then
    # Eğer "rofi" kelimesi geçiyorsa ek parametrelerle çalıştır
    rofi $PARAMS
elif grep -q "menu" "$LAUNCHER_SCRIPT"; then
    glass=""
    if [ "$(cat ~/.config/bilaldot/settings/nwg-panel-glass.sh)" == "true" ]; then
    glass="-s menu-glass.css"
    fi
    fm=$(cat ~/.config/bilaldot/settings/file-manager.sh)
    nwg-menu -ml 6 -mb 6 -fm $fm $glass
elif grep -q "drawer" "$LAUNCHER_SCRIPT"; then
    nwg-drawer -ovl -nocats -wm hyprland
fi
