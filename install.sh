#!/bin/bash

clear
dont_install=false
cat <<"EOF"
 ____  _ _       _ ____        _     ____        _    __ _ _           
| __ )(_) | __ _| |  _ \  ___ | |_  |  _ \  ___ | |_ / _(_) | ___  ___ 
|  _ \| | |/ _` | | | | |/ _ \| __| | | | |/ _ \| __| |_| | |/ _ \/ __|
| |_) | | | (_| | | |_| | (_) | |_  | |_| | (_) | |_|  _| | |  __/\__ \
|____/|_|_|\__,_|_|____/ \___/ \__| |____/ \___/ \__|_| |_|_|\___||___/ 
EOF
echo "By Adnan Bilal ACAR"
echo

if [[ "$1" == "-d" ]]; then
  dont_install=true
fi

read -p "DO YOU WANT TO START THE INSTALLATION NOW? (Yy/Nn): " answer

if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
    echo "Installing Required Packages..."
    if [[ "$dont_install" == "false" ]]; then
    yay -S --noconfirm hyprland-git python nwg-bar nwg-dock-hyprland nwg-panel nwg-menu nwg-drawer nwg-look waybar swww kitty nautilus pywal-git yad woomer wlogout xfce4-taskmanager smile hyprswitch swaync ags hyprsunset rofi-wayland cliphist wl-clipboard nwg-displays hyprdim
    pipx install waypaper
    fi

    echo "Cloning Repository..."
    git clone https://github.com/Bilal1545/BilalDot.git
    cd BilalDot
    cd dotfiles/.config

    echo "Copying configuration files..."
    # .config içindeki tüm klasörleri al
    for folder in */; do
        folder_name=$(basename "$folder")
        config_path="$HOME/.config/$folder_name"

        # Eğer hedef klasör varsa, sil
        if [ -d "$config_path" ]; then
            rm -rf "$config_path"
        fi

        cp -r "$folder" "$config_path"
    done
    cd ../../assets
    cp dotfiles-logo.png /usr/share/bilaldot/bilaldot.png
    cp dotfiles-welcome-logo.png /usr/share/bilaldot/bilaldotwelcome.png
    echo "All files copied successfully."
    echo "Installing Applications..."
    cd ../
    cd bilaldotwelcome/
    ./install.sh -d
    cd ../
    cd bilaldotsettings/
    ./install.sh -d
    cd ../
else
    echo "Operation canceled."
fi
