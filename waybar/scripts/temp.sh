#!/bin/bash
temp=$(sensors | grep 'Package id 0:' | awk '{print $4}' | cut -c2- | head -n1)
echo "{\"text\": \"<span foreground='#ebcb8b'></span> $temp\", \"tooltip\": \"CPU Temperature\"}"
