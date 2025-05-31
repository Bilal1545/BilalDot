#!/bin/bash

darken_color() {
    hex="$1"      # Örn: "#ffcc00"
    factor=0.26   # %74 karartma (1 - 0.74)

    r=$((16#${hex:1:2}))  # Kırmızı
    g=$((16#${hex:3:2}))  # Yeşil
    b=$((16#${hex:5:2}))  # Mavi

    # Karartma işlemi
    r=$(printf "%.0f" "$(echo "$r * $factor" | bc)")
    g=$(printf "%.0f" "$(echo "$g * $factor" | bc)")
    b=$(printf "%.0f" "$(echo "$b * $factor" | bc)")

    # Yeni HEX formatına çevirme
    echo "$r" "$g" "$b"
}

color3="#ffcc00"  # Örnek renk
darken_color "$color3"

