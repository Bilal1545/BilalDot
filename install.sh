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

if [[ "$2" == "-t" ]]; then
 test=true
fi

read -p "DO YOU WANT TO START THE INSTALLATION NOW? (Yy/Nn): " answer

if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
    echo "Installing Required Packages..."
    if [[ "$dont_install" == "false" ]]; then
    yay -S --noconfirm python nwg-bar nwg-dock-hyprland nwg-panel nwg-menu nwg-drawer nwg-look waybar swww kitty nautilus pywal-git yad woomer wlogout xfce4-taskmanager smile hyprswitch swaync ags hyprsunset rofi-wayland cliphist wl-clipboard nwg-displays hyprdim
    pipx install waypaper
    fi

    if [[ "$test" != "true" ]]; then
    git clone https://github.com/Bilal1545/BilalDot/

    cd BilalDot
   fi
    cd dotfiles/.config

    echo "Copying configuration files..."

    # Kaynak dizin (scriptin olduğu yer)
SOURCE_DIR="$(dirname "$(realpath "$0")")"

# Hedef dizin (~/.config)
TARGET_DIR="$HOME/.config"
for folder in "$SOURCE_DIR"/*/; do
    # Sadece gerçekten klasör olanları al
    [ -d "$folder" ] || continue

    # Klasör adını al
    folder_name=$(basename "$folder")

    # Hedef dizindeki ilgili klasör
    target_path="$TARGET_DIR/$folder_name"

    # Eğer hedef klasör yoksa oluştur
    [ -d "$target_path" ] || mkdir -p "$target_path"

    if [[ "$folder_name" == "bilaldot" ]]; then
        # bilaldot klasöründe sadece yeni dosyalar eklenir, var olanlar değiştirilmez
        rsync -av --ignore-existing "$folder" "$target_path"
        echo "🆕 $folder_name klasörüne sadece yeni dosyalar eklendi!"
    else
        # Diğer tüm klasörlerde güncelleme yapılır ama dosyalar silinmez
        rsync -av --progress "$folder" "$target_path" --exclude "custom.conf"
        echo "✅ $folder_name güncellendi!"
    fi
done

echo "🎉 Tüm dotfile'lar güncellendi!"

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
