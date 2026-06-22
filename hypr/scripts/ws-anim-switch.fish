#!/usr/bin/env fish
# Hyprland workspace-change animation switcher (fish shell)
# ---------------------------------------------------------
# Detects direction of workspace change and swaps the bezier curve on the
# `workspaces` animation leaf at runtime via hyprctl keyword.
#   Going right (higher number) → myLeft bezier (slides left)
#   Going left  (lower number)  → myRight bezier (slides right)
# Stores the previous workspace ID in $XDG_RUNTIME_DIR/hypr/prev_ws.

# Get current workspace ID (numeric)
set CURRENT (hyprctl activeworkspace -j | jq -r .id)

# Determine previous workspace (fallback to current on first run)
set PREV_FILE "$XDG_RUNTIME_DIR/hypr/prev_ws"
if test -f $PREV_FILE
    set PREV (cat $PREV_FILE)
else
    set PREV $CURRENT
end

# Save current ID for next invocation
mkdir -p (dirname $PREV_FILE)
echo $CURRENT > $PREV_FILE

# Swap bezier on the real `workspaces` leaf based on direction
if test $CURRENT -gt $PREV
    # Moving right (higher number) → slide left feel
    hyprctl keyword animations:workspaces "1, 5, myLeft, slide" >/dev/null 2>&1
else
    # Moving left (lower number) → slide right feel
    hyprctl keyword animations:workspaces "1, 5, myRight, slide" >/dev/null 2>&1
end
