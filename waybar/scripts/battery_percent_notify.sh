#!/bin/bash
STATE_FILE="/tmp/waybar_battery_notify_state"
battery_path=$(upower -e | grep BAT | head -n1)
if [ -n "$battery_path" ]; then
  battery_percent=$(upower -i "$battery_path" | awk '/percentage:/ {gsub(/%/,""); print int($2)}')
fi
if [ -z "$battery_percent" ]; then
  battery_percent=$(acpi -b 2>/dev/null | grep -oP '[0-9]+(?=%)' | head -1)
fi
if [ -z "$battery_percent" ]; then
  battery_percent=0
fi
# Only notify at 42, 10, or 5 percent (testing with 42)
if [[ "$battery_percent" == "41" || "$battery_percent" == "10" || "$battery_percent" == "5" ]]; then
  last_notified=$(cat "$STATE_FILE" 2>/dev/null)
  if [ "$last_notified" != "$battery_percent" ]; then
    notify-send -e -t 10000 "Battery Low" "Your battery is at $battery_percent%!"
    echo "$battery_percent" >"$STATE_FILE"
  fi
else
  # Reset notification state if above 42 (adjusted for testing)
  if [ "$battery_percent" -gt 42 ]; then
    rm -f "$STATE_FILE"
  fi
fi
echo "$battery_percent%"
