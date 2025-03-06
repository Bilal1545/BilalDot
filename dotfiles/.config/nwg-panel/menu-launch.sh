if [ "$(cat ~/.config/bilaldot/settings/nwg-panel.sh)" = "true" ]; then
theme="-s menu-$(cat ~/.config/bilaldot/settings/nwg-theme.sh).css"
fm=$(cat ~/.config/bilaldot/settings/file-manager.sh)
    nwg-menu -ml 5 -mb 5 -fm $fm $theme
fi

