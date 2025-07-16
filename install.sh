#!/bin/bash

# Terminal color codes
green="\e[32m"
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

# Install confirmation
read -p "Do you want to install Bi-Shell dependencies? (y/n): " install_answer

if [[ "$install_answer" == "y" || "$install_answer" == "Y" ]]; then
    echo -e "${green}Installing dependencies...${reset}"
    yay -S --noconfirm swww pywal-git ags cliphist wl-clipboard
else
    echo "Dependency installation skipped."
fi

# Copy .config directory to ~/.config
echo -e "${green}Copying .config directories to ~/.config...${reset}"
rsync -a .config/ ~/.config/


echo -e "${green}Installation completed.${reset}"
