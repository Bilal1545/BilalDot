#!/bin/sh

LAUNCHER_SCRIPT="$HOME/.config/bilaldot/settings/launcher.sh"

# Ek parametreleri al
PARAMS="$@"

# Dosya içeriğini kontrol et
if grep -q "rofi" "$LAUNCHER_SCRIPT"; then
    # Eğer "rofi" kelimesi geçiyorsa ek parametrelerle çalıştır
    rofi $PARAMS
elif grep -q "menu" "$LAUNCHER_SCRIPT"; then
    ~/.config/nwg-panel/menu-launch.sh
elif grep -q "drawer" "$LAUNCHER_SCRIPT"; then
    nwg-drawer -ovl -nocats -wm hyprland
fi
