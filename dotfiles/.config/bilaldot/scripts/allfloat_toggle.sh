#!/bin/bash

# Windowrule dosyasının konumu
RULES_FILE="$HOME/.config/bilaldot/settings/allfloat.conf"

# Eklemek/kaldırmak istediğimiz satır
RULE_LINE="windowrulev2 = float, title:.*"

# Dosya mevcut mu kontrol et, yoksa oluştur
if [[ ! -f "$RULES_FILE" ]]; then
    touch "$RULES_FILE"
fi

# Dosyada satır var mı kontrol et
if grep -q "$RULE_LINE" "$RULES_FILE"; then
    # Satır varsa, kaldır
    sed -i "/$RULE_LINE/d" "$RULES_FILE"
    notify-send Float "New windows are not floating now."
else
    # Satır yoksa, ekle
    echo "$RULE_LINE" >> "$RULES_FILE"
    notify-send Float "New windows are floating now."
fi

