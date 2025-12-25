#!/bin/bash

# Get raw temperature number (assumed Fahrenheit)
temp_f=$(sensors | awk '/Package id 0:/ {gsub(/[+°]/,"",$4); print $4}')

# Convert F → C
temp_c=$(awk "BEGIN {printf \"%.1f\", ($temp_f - 32) * 5 / 9}")

echo "{\"text\": \"<span foreground='#ebcb8b'></span> ${temp_c}°C\", \"tooltip\": \"CPU Temperature\"}"
