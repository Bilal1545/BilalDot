#!/bin/bash

clear
dont_install=false
echo Bi-Shell
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
    yay -S --noconfirm swww pywal-git ags cliphist wl-clipboard
    fi

    read -p "Bi-Shell is have two branches 1: Default 2: WindOS (1/2): " branch

    if [[ "$test" != "true" ]]; then
    if [[ "$branch" == 2 ]]; then
    git clone --branch WindOS --single-branch https://github.com/Bilal1545/BilalDot/
    fi

    if [[ "$branch" == 1 ]]; then
    git clone https://github.com/Bilal1545/BilalDot/
    fi

    cd BilalDot
   fi
    cd dotfiles/.config

    echo "Copying configuration files..."

    # Kaynak dizin (scriptin olduğu yer)
SOURCE_DIR="$(dirname "$(realpath "$0")")"
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
    else
        # Diğer tüm klasörlerde güncelleme yapılır ama dosyalar silinmez
        rsync -av --progress "$folder" "$target_path" --exclude "custom.conf"
    fi
done
else
    echo "Operation canceled."
fi
