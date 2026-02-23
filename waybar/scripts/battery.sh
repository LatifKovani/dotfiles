#!/bin/bash

# Get battery percentage from upower (works on most laptops)
battery_percent=$(upower -i $(upower -e | grep 'BAT') | awk '/percentage:/ {print int($2)}')
if [ -z "$battery_percent" ]; then
  # fallback to acpi
  battery_percent=$(acpi -b 2>/dev/null | grep -oP '[0-9]+(?=%)' | head -1)
fi
if [ -z "$battery_percent" ]; then
  battery_percent=0
fi

# Choose battery icon based on charge level
if [ "$battery_percent" -ge 95 ]; then
  icon=" " # Full
elif [ "$battery_percent" -ge 75 ]; then
  icon=" "
elif [ "$battery_percent" -ge 50 ]; then
  icon=" "
elif [ "$battery_percent" -ge 25 ]; then
  icon=" "
elif [ "$battery_percent" -ge 10 ]; then
  icon=" "
else
  icon=" " # Empty
fi

# Bar settings
bar_length=15
filled=$((battery_percent * bar_length / 100))
if [ $filled -gt $bar_length ]; then filled=$bar_length; fi
empty=$((bar_length - filled))

bar=""
for ((i = 0; i < filled; i++)); do bar+="─"; done
for ((i = 0; i < empty; i++)); do bar+=" "; done

echo "$icon $bar"
