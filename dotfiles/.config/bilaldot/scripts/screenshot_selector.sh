#!/bin/sh

CHOICE="$1"

case "$CHOICE" in
    region)
    sleep 1
        grimblast --notify --freeze copysave area /tmp/screenshot.png && satty -f /tmp/screenshot.png
        ;;
    full)
    sleep 1
        grimblast --notify --freeze copysave screen /tmp/screenshot.png && satty -f /tmp/screenshot.png
        ;;
    text)
        grim -g "$(slurp)" - | tesseract - stdout -l eng+tur | wl-copy
        ;;
esac

