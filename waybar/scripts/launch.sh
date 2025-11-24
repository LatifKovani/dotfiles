#!/bin/bash

# Kill any running waybar instances
killall -q waybar

# Wait until the processes have been shut down
while pgrep -u $UID -x waybar >/dev/null; do sleep 1; done

# Create initial dynamic.css file
cat > ~/.config/waybar/dynamic.css << EOF
#cpu::after {
    width: 0%;
}

#memory::after {
    width: 0%;
}

#pulseaudio::after {
    width: 0%;
}

#battery::after {
    width: 0%;
}
EOF

# Start the custom script to update progress bars
pkill -f ~/.config/waybar/custom-script.sh
~/.config/waybar/custom-script.sh &

# Launch waybar with our custom config
waybar -c ~/.config/waybar/config-bottom.jsonc -s ~/.config/waybar/style-bottom.css &

echo "Waybar launched..."
