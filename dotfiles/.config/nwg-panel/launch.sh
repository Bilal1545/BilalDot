if [ "$(cat ~/.config/bilaldot/settings/nwg-panel.sh)" = "true" ]; then
theme="-s style-$(cat ~/.config/bilaldot/settings/nwg-theme.sh).css"
float=""
    if [ "$(cat ~/.config/bilaldot/settings/nwg-theme.sh)" = "modern" ]; then
        float="-c config-not-floating"
    fi
    echo $theme $float
    nwg-panel $theme $float
fi

