#!/bin/bash
ram_used=$(free -b | awk '/^Mem:/ {print $3}')
ram_total=$(free -b | awk '/^Mem:/ {print $2}')
ram_percent=$(awk "BEGIN {printf \"%.0f\", ($ram_used/$ram_total)*100}")
echo "{\"text\": \"<span foreground='#ebcb8b'> </span> $ram_percent%\", \"tooltip\": \"RAM Usage: $ram_percent%\"}"
