#!/bin/bash

clear
cat <<"EOF"
 ____  _ _       _ ____        _     ____        _    __ _ _           
| __ )(_) | __ _| |  _ \  ___ | |_  |  _ \  ___ | |_ / _(_) | ___  ___ 
|  _ \| | |/ _` | | | | |/ _ \| __| | | | |/ _ \| __| |_| | |/ _ \/ __|
| |_) | | | (_| | | |_| | (_) | |_  | |_| | (_) | |_|  _| | |  __/\__ \
|____/|_|_|\__,_|_|____/ \___/ \__| |____/ \___/ \__|_| |_|_|\___||___/ 
EOF
echo "By Adnan Bilal ACAR"
echo

echo "Are you sure for installing Bilaldot Dotfiles? (y/n)"
read -l answer  # Kullanıcıdan input alıyoruz

if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
    echo "Installing Required Packages..."
    #yay -S --noconfirm hyprland-git python nwg-bar nwg-dock-hyprland nwg-panel nwg-menu nwg-drawer nwg-look waybar swww kitty nautilus pywal-git yad woomer wlogout xfce4-taskmanager smile hyprswitch swaync ags hyprsunset rofi-wayland cliphist wl-clipboard
    #pipx install waypaper

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
            echo "Deleting existing directory: $config_path"
            rm -rf "$config_path"
        fi

        # Klasörü kopyala
        echo "Copying $folder_name to ~/.config/"
        cp -r "$folder" "$config_path"
    done
    cd ../../assets
    cp dotfiles-logo.png /usr/share/bilaldot/bilaldot.png
    cp dotfiles-welcome-logo.png /usr/share/bilaldot/bilaldotwelcome.png
    echo "All files copied successfully."
    echo "Installing Applications..."
    cd ../apps/bilaldotsettings/
    ./install.sh -d
    cd ../bilaldotwelcome/
    ./install.sh -d
    cd ../../
    rm -rf ~/wallpapers
    cp -r wallpapers ~/
else
    echo "Operation canceled."
fi
