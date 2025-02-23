#!/bin/bash

current_ws=$(hyprctl activeworkspace -j | jq '.id')

target_ws=$((current_ws + $1))

hyprctl dispatch movetoworkspace "$target_ws"
hyprctl dispatch workspace "$target_ws"
