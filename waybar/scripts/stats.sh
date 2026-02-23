#!/bin/bash
cpu=$(top -bn1 | grep "Cpu(s)" | awk '{printf "%.0f%%", $2 + $4}')
ram=$(free -b | awk '/^Mem:/ {printf "%.1fG", $3/1024/1024/1024}')
if systemctl is-active bluetooth >/dev/null 2>&1; then bt="󰂱"; else bt="󰂲"; fi
if nmcli -t -f active dev wifi | grep -q yes; then wifi="󰤨"; else wifi="󰤭"; fi
bat=$(cat /sys/class/power_supply/BAT*/capacity 2>/dev/null | head -1)
echo "$cpu  $ram  $bt  $wifi  $bat%"
