#!/bin/bash

# Kullanım: change_wallpaper.sh /path/to/wallpaper.png

# Yeni duvar kağıdı yolu
file_path="$1"


# Ön belleğe kaydetmek için dizin
CACHE_DIR="$HOME/.cache/bilaldot"
CURRENT_WALLPAPER="$CACHE_DIR/current-wallpaper.png"

# Dizin oluştur
mkdir -p "$CACHE_DIR"


if [[ "$file_path" != *.png ]]; then
    echo "Dosya PNG değil, dönüştürülüyor..."

    # ImageMagick ile PNG'ye çevirme
    convert "$file_path" "$new_path" && rm "$file_path"

    # Eğer dönüştürme başarılı olduysa, yeni dosya yolunu değişkene kaydet
    if [[ -f "$new_path" ]]; then
        export WALLPAPER_PATH="$new_path"
        echo "Dönüştürüldü ve yeni yol: $WALLPAPER_PATH"
    else
        echo "Dönüştürme başarısız!"
        exit 1
    fi
else
    WALLPAPER_PATH="$file_path"
fi

cp "$WALLPAPER_PATH" "$CURRENT_WALLPAPER"

# Wallpaper'dan renkleri al ve uygula (hızlı mod, shell renklerini değiştirme)
wal -i "$CURRENT_WALLPAPER" -n -s

# `reload.sh` scriptini farklı bir shell ortamında bağımsız çalıştır
hyprctl dispatch exec $HOME/.config/bilaldot/scripts/reload.sh
