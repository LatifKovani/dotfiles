#!/bin/bash

# File to track notification state
STATE_FILE="/tmp/waybar_battery_notified"

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

# Read the last notified level
if [ -f "$STATE_FILE" ]; then
  last_notified=$(cat "$STATE_FILE")
else
  last_notified=100
fi

# Check if discharging and send notifications
if [ "$battery_state" = "discharging" ] || [ "$battery_state" = "Discharging" ]; then
  if [ "$battery_percent" -le 25 ] && [ "$last_notified" -gt 25 ]; then
    notify-send -u normal -t 10000 "Battery Low" "Battery at ${battery_percent}%. Consider charging. "
    echo 25 > "$STATE_FILE"
  elif [ "$battery_percent" -le 5 ] && [ "$last_notified" -gt 5 ]; then
    notify-send -u critical -t 10000 "Battery Critical" "Battery at ${battery_percent}%! Plug in charger NOW!"
    echo 5 > "$STATE_FILE"
  elif [ "$battery_percent" -le 10 ] && [ "$last_notified" -gt 10 ]; then
    notify-send -u critical -t 10000 "Battery Very Low" "Battery at ${battery_percent}%! Please charge soon."
    echo 10 > "$STATE_FILE"
  elif [ "$battery_percent" -le 20 ] && [ "$last_notified" -gt 20 ]; then
    notify-send -u normal -t 10000 "Battery Low" "Battery at ${battery_percent}%. Plug in charger"
    echo 20 > "$STATE_FILE"
  fi
else
  # Reset notification state when charging or full
  if [ "$last_notified" -lt 100 ]; then
    echo 100 > "$STATE_FILE"
  fi
fi

# Only show icon when charging
if [ "$battery_state" = "charging" ] || [ "$battery_state" = "Charging" ]; then
  icon=" 󱐋" # Charging icon with space
  echo "{\"text\": \"$battery_percent%$icon\"}"
else
  echo "{\"text\": \"$battery_percent%\"}"
fi
