position="$(cat ~/.config/bilaldot/settings/volume-notification-position.sh)"
orientation="$(cat ~/.config/bilaldot/settings/volume-notification-orientation.sh)"

syshud -p $position -o $orientation
