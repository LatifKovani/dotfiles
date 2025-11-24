#!/bin/bash

icon_on=" "  # Nerd Font Bluetooth icon (nf-md-bluetooth)
icon_off="󰂲 " # Nerd Font Bluetooth off icon (nf-md-bluetooth-off)

if systemctl is-active bluetooth >/dev/null 2>&1; then
    status="on"
    icon="$icon_on"
else
    status="off"
    icon="$icon_off"
fi

# Get currently connected devices
connected_devices=$(bluetoothctl info | awk '/Device/ {print $2}')
connected_names=""
for dev in $connected_devices; do
    name=$(bluetoothctl info "$dev" | awk -F ': ' '/Name/ {print $2}')
    if [ -n "$name" ]; then
        connected_names+="$name, "
    fi
done
connected_names=${connected_names%, } # remove trailing comma

# Get paired devices
paired_devices=$(bluetoothctl paired-devices | awk '{print $2}')
paired_names=""
for dev in $paired_devices; do
    name=$(bluetoothctl info "$dev" | awk -F ': ' '/Name/ {print $2}')
    if [ -n "$name" ]; then
        paired_names+="$name, "
    fi
done
paired_names=${paired_names%, }

# Tooltip logic
if [ "$status" = "off" ]; then
    tooltip="Bluetooth: Off"
elif [ -n "$connected_names" ]; then
    tooltip="Connected: $connected_names\nPaired: $paired_names"
else
    tooltip="Bluetooth: On\nPaired: $paired_names"
fi

# Output for Waybar
echo "{\"text\": \"<span foreground='#97b67c'>$icon</span>\", \"tooltip\": \"$tooltip\"}"

# Click actions (handled by Waybar config)
# Left-click: Toggle Bluetooth on/off
# Right-click: Open bluetooth settings (blueman-manager or bluetoothctl)
