#!/bin/bash
# Shows free/total disk space in GB for root (/)

FREE=$(df -BG --output=avail / | tail -1 | tr -dc '0-9')
TOTAL=$(df -BG --output=size / | tail -1 | tr -dc '0-9')
ICON=""
echo "$ICON ${FREE}GB free / ${TOTAL}GB"
