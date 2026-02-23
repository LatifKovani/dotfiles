#!/bin/bash

# Get current values
function get_cpu() {
    top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}' | awk -F. '{print $1}'
}

function get_memory() {
    free -m | grep Mem | awk '{print ($3/$2) * 100}' | awk -F. '{print $1}'
}

function get_volume() {
    pactl get-sink-volume @DEFAULT_SINK@ | grep -Po '\d+(?=%)' | head -n 1
}

function get_battery() {
    acpi -b | grep -Po '\d+(?=%)' | head -n 1
}

# Update CSS properties
function update_css() {
    CPU=$(get_cpu)
    MEM=$(get_memory)
    VOL=$(get_volume)
    BAT=$(get_battery)
    
    # Create or update CSS file with dynamic values
    cat > ~/.config/waybar/dynamic.css << EOF
#cpu::after {
    width: ${CPU}%;
}

#memory::after {
    width: ${MEM}%;
}

#pulseaudio::after {
    width: ${VOL}%;
}

#battery::after {
    width: ${BAT}%;
}
EOF
}

# Run continuously to update values
while true; do
    update_css
    sleep 1
done
