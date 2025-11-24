#!/bin/bash

# Get brightness as a percent using brightnessctl (you may need to install it)
brightness=$(brightnessctl g 2>/dev/null)
max_brightness=$(brightnessctl m 2>/dev/null)

if [ -z "$brightness" ] || [ -z "$max_brightness" ] || [ "$max_brightness" -eq 0 ]; then
  percent=0
else
  percent=$((brightness * 100 / max_brightness))
fi

icon=""  # You can use 󰃠 or 󰃝 or another Nerd Font brightness icon

bar_length=15
filled=$((percent * bar_length / 100))
((filled > bar_length)) && filled=$bar_length
empty=$((bar_length - filled))

bar=""
for ((i=0; i<filled; i++)); do bar+="─"; done
for ((i=0; i<empty; i++)); do bar+=" "; done

echo "$icon $bar"
