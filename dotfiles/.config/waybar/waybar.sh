#!/usr/bin/env sh

# Wait until the processes have been shut down
while pgrep -x waybar >/dev/null; do sleep 1; done

if [ "$(cat ~/.config/bilaldot/settings/waybar.sh)" == "true" ]; then
waybar
fi
