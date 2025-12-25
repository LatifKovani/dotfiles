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

# Only show icon when charging
if [ "$battery_state" = "charging" ] || [ "$battery_state" = "Charging" ]; then
  icon=" 󱐋" # Charging icon with space
  echo "{\"text\": \"$battery_percent%$icon\"}"
else
  echo "{\"text\": \"$battery_percent%\"}"
fi
