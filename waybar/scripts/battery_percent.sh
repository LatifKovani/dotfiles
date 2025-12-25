#!/bin/bash

# Get battery path
battery_path=$(upower -e | grep BAT | head -n1)

if [ -n "$battery_path" ]; then
  battery_percent=$(upower -i "$battery_path" | awk '/percentage:/ {gsub(/%/,""); print int($2)}')
  battery_state=$(upower -i "$battery_path" | awk '/state: / {print $2}')
else
  battery_percent=$(acpi -b 2>/dev/null | grep -oP '[0-9]+(?=%)' | head -1)
  battery_state=$(acpi -b 2>/dev/null | grep -oP '(Charging|Discharging|Full)')
fi

if [ -z "$battery_percent" ]; then
  battery_percent=0
fi

# Choose icon based on charging state and battery level
if [ "$battery_state" = "charging" ] || [ "$battery_state" = "Charging" ]; then
  icon="󱐋" # Charging icon
elif [ "$battery_percent" -ge 90 ]; then
  icon="󰁹" # 100%
elif [ "$battery_percent" -ge 80 ]; then
  icon="󰂂" # 90%
elif [ "$battery_percent" -ge 70 ]; then
  icon="󰂁" # 80%
elif [ "$battery_percent" -ge 60 ]; then
  icon="󰂀" # 70%
elif [ "$battery_percent" -ge 50 ]; then
  icon="󰁿" # 60%
elif [ "$battery_percent" -ge 40 ]; then
  icon="󰁾" # 50%
elif [ "$battery_percent" -ge 30 ]; then
  icon="󰁽" # 40%
elif [ "$battery_percent" -ge 20 ]; then
  icon="󰁼" # 30%
elif [ "$battery_percent" -ge 10 ]; then
  icon="󰁻" # 20%
else
  icon="󰁺" # 10% or less
fi

echo "{\"text\": \"$icon $battery_percent%\"}"
