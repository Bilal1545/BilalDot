#!/bin/bash

# Terminal color codes
green="\e[32m"
red="\e[31m"
reset="\e[0m"

clear
cat << "EOF"
 ____  _      ____  _          _ _   _   _           _       _       
| __ )(_)    / ___|| |__   ___| | | | | | |_ __   __| | __ _| |_ ___ 
|  _ \| |____\___ \| '_ \ / _ \ | | | | | | '_ \ / _` |/ _` | __/ _ \
| |_) | |_____|__) | | | |  __/ | | | |_| | |_) | (_| | (_| | ||  __/
|____/|_|    |____/|_| |_|\___|_|_|  \___/| .__/ \__,_|\__,_|\__\___|
                                          |_|                        
EOF
echo By Adnan Bilal ACAR
echo

# Ask for sudo password upfront
if ! sudo -v 2>/dev/null; then
    echo -e "${red}Cannot get sudo access. Exiting.${reset}"
    exit 1
fi

# Keep sudo alive for the duration of the script (silent)
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

# Install confirmation (looped)
while true; do
    read -p "Do you want to update Bi-Shell dependencies? (Yy/Nn) (Default: Y): " install_answer

    if [[ "$install_answer" == "y" || "$install_answer" == "Y" || "$install_answer" == "" ]]; then
        echo -e "${green}Installing dependencies...${reset}"
        yay -S --noconfirm swww ags cliphist wl-clipboard hyprland matugen
        break
    elif [[ "$install_answer" == "n" || "$install_answer" == "N" ]]; then
        echo -e "${red}Dependency update skipping...${reset}"
        break
    else
        echo -e "${red}Unavailable answer. Please retry.${reset}"
    fi
done

tmpdir=$(mktemp -d -t bi-shell-XXXX)
git clone https://github.com/Bilal1545/BilalDot.git "$tmpdir"
cd "$tmpdir"

# Copy .config directory to ~/.config
#echo -e "${green}Copying .config directories to ~/.config...${reset}"
#rsync -a .config/ ~/.config/

echo -e "${green}Reinstalling the shell...${reset}"
cd ./shell/
sudo rm /usr/share/bi-shell
sudo ags bundle app.ts /usr/share/bi-shell

cd ../

rm ~/.config/hypr/bi-shell.conf
cp ./bi-shell.conf ~/.config/hypr/bi-shell.conf

rm ~/.config/matugen/bi-shell.json
cp ./bi-shell.json ~/.config/matugen/bi-shell.json

cd ~
rm -rf "$tmpdir"

echo -e "${green}Update completed."
