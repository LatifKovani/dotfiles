#!/bin/bash

INTERFACE=$(ip route | awk '/default/ {print $5; exit}')
RX_FILE="/tmp/.waybar_net_rx"
TX_FILE="/tmp/.waybar_net_tx"

if [[ -z "$INTERFACE" ]]; then
    echo "No network"
    exit 0
fi

RX_NOW=$(cat /sys/class/net/"$INTERFACE"/statistics/rx_bytes 2>/dev/null)
TX_NOW=$(cat /sys/class/net/"$INTERFACE"/statistics/tx_bytes 2>/dev/null)

if [[ -z "$RX_NOW" || -z "$TX_NOW" ]]; then
    echo "No data"
    exit 0
fi

if [[ -f "$RX_FILE" && -f "$TX_FILE" ]]; then
    RX_OLD=$(cat "$RX_FILE")
    TX_OLD=$(cat "$TX_FILE")
    RX_RATE=$(( (RX_NOW - RX_OLD) / 1024 ))
    TX_RATE=$(( (TX_NOW - TX_OLD) / 1024 ))
else
    RX_RATE=0
    TX_RATE=0
fi

echo "$RX_NOW" > "$RX_FILE"
echo "$TX_NOW" > "$TX_FILE"

# Use Nerd Font arrows:  (up) and  (down)
echo " ${TX_RATE}K/s   ${RX_RATE}K/s"
