#!/bin/bash
    if nmcli -t -f active dev wifi | grep -q yes; then
        ssid=$(nmcli -t -f active,ssid dev wifi | grep yes | cut -d: -f2)
        echo "{\"text\": \"󰤨 ${ssid}\", \"tooltip\": \"Connected: ${ssid}\"}"
    else
        echo "{\"text\": \"󰤭\", \"tooltip\": \"Disconnected\"}"
    fi
    sleep 5
