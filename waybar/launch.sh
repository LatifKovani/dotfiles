#!/bin/bash

# Kill any running waybar instances
killall -q waybar

# Wait until the processes have been shut down
while pgrep -u $UID -x waybar >/dev/null; do sleep 1; done

# Make sure scripts are executable
chmod +x ~/.config/waybar/scripts/*.sh

# Launch waybar with our custom config
waybar -c ~/.config/waybar/config-bottom.jsonc -s ~/.config/waybar/style-bottom.css &

echo "Waybar launched..."
