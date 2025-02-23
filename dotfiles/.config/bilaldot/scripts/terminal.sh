#!/bin/bash

TERMINAL_COMMAND=$(cat ~/.config/bilaldot/settings/terminal.sh)

ARGS="$@"

FINAL_COMMAND="$TERMINAL_COMMAND $ARGS"

eval "$FINAL_COMMAND"

