#!/bin/bash
ram_used=$(free -b | awk '/^Mem:/ {printf "%.2f", $3/1024/1024/1024}')
ram_total=$(free -b | awk '/^Mem:/ {printf "%.2f", $2/1024/1024/1024}')
echo "{\"text\": \"<span foreground='#ebcb8b'> </span> $ram_used/$ram_total GiB\", \"tooltip\": \"RAM Usage: $ram_used of $ram_total GiB\"}"
