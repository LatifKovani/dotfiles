#!/bin/bash
cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}')
echo "{\"text\": \"<span foreground='#ebcb8b'> </span> $cpu_usage%\", \"tooltip\": \"CPU Usage\"}"
