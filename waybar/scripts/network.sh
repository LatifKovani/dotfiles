#!/bin/bash
interface=$(ip route | grep default | awk '{print $5}')
if [ -n "$interface" ]; then
    ipaddr=$(ip addr show "$interface" | grep 'inet ' | awk '{print $2}' | cut -d/ -f1)
    echo "{\"text\": \"<span foreground='#ebcb8b'></span> $ipaddr\", \"tooltip\": \"Network: $interface\"}"
else
    echo "{\"text\": \"<span foreground='#bf616a'>睊</span> Disconnected\", \"tooltip\": \"No network\"}"
fi
