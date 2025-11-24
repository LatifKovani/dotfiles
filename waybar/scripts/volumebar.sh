#!/bin/bash

# Get the current volume (works with pipewire or pulseaudio)
volume=$(wpctl get-volume @DEFAULT_AUDIO_SINK@ 2>/dev/null | awk '{print int($2 * 100)}')
if [ -z "$volume" ]; then
  # fallback to pactl/pulseaudio
  volume=$(pactl get-sink-volume @DEFAULT_SINK@ 2>/dev/null | grep -oP '[0-9]{1,3}(?=%)' | head -1)
fi
if [ -z "$volume" ]; then
  volume=0
fi

# Mute status
muted=$(wpctl get-volume @DEFAULT_AUDIO_SINK@ 2>/dev/null | grep -q MUTED && echo 1 || echo 0)
if [ $muted -eq 1 ]; then
  icon="󰝟"
else
  icon="󰕾"
fi

# Bar settings
bar_length=15
filled=$((volume * bar_length / 100))
if [ $filled -gt $bar_length ]; then filled=$bar_length; fi
empty=$((bar_length - filled))

bar=""
for ((i=0; i<filled; i++)); do bar+="─"; done
for ((i=0; i<empty; i++)); do bar+=" "; done

echo "$icon $bar"
