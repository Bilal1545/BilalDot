if [ "$(cat ~/.config/bilaldot/settings/nwg-panel.sh)" = "true" ]; then
    glass=""
    float=""

    if [ "$(cat ~/.config/bilaldot/settings/nwg-panel-glass.sh)" = "true" ]; then
        glass="-s style-glass.css"
    fi

    if [ "$(cat ~/.config/bilaldot/settings/nwg-panel-floating.sh)" = "true" ]; then
        echo "@import url(\"../../nwg-panel/source.css\");" > ~/.config/bilaldot/settings/nwg-panel-floating.css
    else
        float="-c config-not-floating"
        echo "@import url(\"../../nwg-panel/source-not-floating.css\");" > ~/.config/bilaldot/settings/nwg-panel-floating.css
    fi

    nwg-panel $glass $float
fi

