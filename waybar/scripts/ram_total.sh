#!/bin/bash
# Shows total RAM in GiB
TOTAL=$(free -m | awk '/Mem:/ { printf "%.0f", $2/1024 }')
echo "$TOTAL GiB"
