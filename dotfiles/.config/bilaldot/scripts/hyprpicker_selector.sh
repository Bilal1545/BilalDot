#!/bin/sh

CHOICE="$1"

case "$CHOICE" in
    hex)
    sleep 0.8
        hyprpicker | wl-copy
        ;;
    rgb)
    sleep 0.8
        hyprpicker | awk '{printf "rgb(%d, %d, %d\n)", strtonum("0x"substr($1,2,2)), strtonum("0x"substr($1,4,2)), strtonum("0x"substr($1,6,2))}' | wl-copy
        ;;
esac

