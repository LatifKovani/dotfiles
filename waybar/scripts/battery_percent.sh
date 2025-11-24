#!/bin/bash

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

echo "{\"text\": \"$battery_percent%\"}"
