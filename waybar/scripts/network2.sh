#!/bin/bash
# Replace eth0 with your actual interface name (e.g., enp3s0, wlan0)
INTERFACE="wlp0s20f3"
RX_BYTES=$(cat /sys/class/net/$INTERFACE/statistics/rx_bytes)
RX_MIB=$(awk "BEGIN {printf \"%.0f\", $RX_BYTES/1024/1024}")
echo "{\"text\": \"<span foreground='#ebcb8b'> </span> $RX_MIB MiB\", \"tooltip\": \"Downloaded: $RX_MIB MiB on $INTERFACE\"}"
