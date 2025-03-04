#!/bin/bash
clear

dont_ask=false

if [[ "$1" == "-d" ]]; then
  dont_ask=true
  answer=y
fi

if [[ "$dont_ask" == "false" ]]; then

cat <<"EOF"
 ____       _               
/ ___|  ___| |_ _   _ _ __  
\___ \ / _ \ __| | | | '_ \ 
 ___) |  __/ |_| |_| | |_) |
|____/ \___|\__|\__,_| .__/ 
                     |_|    
EOF
echo "for BilalDot Settings"
echo
echo "by Adnan Bilal ACAR"
echo

echo "Are you sure for installing Bilaldotsettings? (y/n)"
answer=$(read -r answer)
fi


if [[ "$answer" == "y" || "$answer" == "Y" ]]; then

# Copy the executable to /usr/bin
sudo rm /usr/bin/bilaldotsettings
sudo install -m 755 app.py /usr/bin/bilaldotsettings

# Copy assets to /usr/share/bilaldotsettings
sudo mkdir -p /usr/share/bilaldot/
sudo rm /usr/share/bilaldot/settings.ui
sudo cp settings.ui /usr/share/bilaldot/

sudo rm /usr/share/applications/bilaldotsettings.desktop
# Copy the desktop file

sudo cp bilaldotsettings.desktop /usr/share/applications/
fi
