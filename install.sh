#!/bin/bash

# Terminal color codes
green="\e[32m"
red="\e[31m"
reset="\e[0m"

clear
cat << "EOF"
 ____  _           ____  _          _ _ 
| __ )(_)         / ___|| |__   ___| | |
|  _ \| |  _____  \___ \| '_ \ / _ \ | |
| |_) | | |_____|  ___) | | | |  __/ | |
|____/|_|         |____/|_| |_|\___|_|_|
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
    read -p "Do you want to install Bi-Shell dependencies? (Yy/Nn) (Default: Y): " install_answer

    if [[ "$install_answer" == "y" || "$install_answer" == "Y" || "$install_answer" == "" ]]; then
        echo -e "${green}Installing dependencies...${reset}"
        yay -S --noconfirm swww ags cliphist wl-clipboard hyprland matugen
        break
    elif [[ "$install_answer" == "n" || "$install_answer" == "N" ]]; then
        echo -e "${red}Dependency installation skipping...${reset}"
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

echo -e "${green}Installing the shell...${reset}"
cd ./shell/
sudo rm -rf /usr/share/bi-shell
sudo ags bundle app.ts /usr/share/bi-shell

cd ../

cp ./bi-shell.conf ~/.config/hypr/bi-shell.conf
sed -i "source = ~/.config/hypr/bi-shell.conf" ~/.config/hypr/hyprland.conf

mkdir -p ~/matugen

# Matugen confirmation (looped)
while true; do
    read -p "Are you using Matugen already? (Yy/Nn) (Default: N): " matugen_answer

    if [[ "$matugen_answer" == "y" || "$matugen_answer" == "Y" ]]; then
        echo -e "${green}Installing dependencies...${reset}"
        yay -S --noconfirm swww ags cliphist wl-clipboard hyprland matugen
        break
    elif [[ "$matugen_answer" == "n" || "$matugen_answer" == "N" || "$matugen_answer" == "" ]]; then
        echo -e "${red}Dependency installation skipping...${reset}"
        break
    else
        echo -e "${red}Unavailable answer. Please retry.${reset}"
    fi
done

echo -e "Copying icon files..."
rm -rf ~/.local/share/icons/BiShell
mkdir -p ~/.local/share/icons/BiShell/scalable/apps
cp ./assets/logo.svg ~/.local/share/icons/BiShell/scalable/apps/logo.svg
gtk-update-icon-cache ~/.local/share/icons/BiShell

cd ~
rm -rf "$tmpdir"

echo -e "${green}Installation completed.${reset}"
