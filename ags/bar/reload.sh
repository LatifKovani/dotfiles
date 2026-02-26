#!/bin/bash
pkill -f "ags" &>/dev/null
sleep 0.5
cd ~/.config/ags/bar && ags run . &
disown
