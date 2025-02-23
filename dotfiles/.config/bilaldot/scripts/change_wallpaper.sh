#!/bin/bash

pkill -f hyprswitch
# Kullanım: change_wallpaper.sh /path/to/wallpaper.png

# Yeni duvar kağıdı yolu
WALLPAPER_PATH="$1"

# Eğer parametre verilmediyse hata ver
if [ -z "$WALLPAPER_PATH" ]; then
    echo "Hata: Lütfen bir duvar kağıdı yolu belirtin!"
    exit 1
fi

# Ön belleğe kaydetmek için dizin
CACHE_DIR="$HOME/.cache/bilaldot"
CURRENT_WALLPAPER="$CACHE_DIR/current-wallpaper.png"

# Dizin oluştur
mkdir -p "$CACHE_DIR"

# Yeni duvar kağıdını önbelleğe kopyala
cp "$WALLPAPER_PATH" "$CURRENT_WALLPAPER"

# Wallpaper'dan renkleri al ve uygula (hızlı mod, shell renklerini değiştirme)
wal -i "$CURRENT_WALLPAPER" -n -s


# `reload.sh` scriptini farklı bir shell ortamında bağımsız çalıştır
hyprctl dispatch exec $HOME/.config/bilaldot/scripts/reload.sh

