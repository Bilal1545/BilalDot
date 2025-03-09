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
    yay -S --noconfirm python nwg-bar nwg-dock-hyprland nwg-panel nwg-menu nwg-drawer nwg-look waybar swww kitty nautilus pywal-git yad woomer wlogout xfce4-taskmanager smile hyprswitch swaync ags hyprsunset rofi-wayland cliphist wl-clipboard nwg-displays hyprdim
    pipx install waypaper
    fi


    cd dotfiles/.config

    echo "Copying configuration files..."

    for dir in */; do
    dir_name="${dir%/}"  # Sondaki / işaretini kaldır
    config_path="$HOME/.config/$dir_name"
    
    # Yeni dizini ~/.config içine kopyala (var olanı değiştirme)
    echo "Kopyalanıyor: $dir_name -> $config_path"
    cp -r "$dir_name" "$config_path"
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
else
    echo "Operation canceled."
fi
