-- ~/.config/hypr/conf/autostart.lua
-- Runs once when Hyprland starts — not re-executed on config reload

hl.on("hyprland.start", function()
	hl.exec_cmd("bash ~/.config/hypr/xdg-portal-hyprland")
	hl.exec_cmd("dbus-update-activation-environment --systemd WAYLAND_DISPLAY XDG_CURRENT_DESKTOP")
	hl.exec_cmd("systemctl --user import-environment WAYLAND_DISPLAY XDG_CURRENT_DESKTOP")
	hl.exec_cmd("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")
	hl.exec_cmd("hypridle")
	hl.exec_cmd("ags run ~/.config/ags/bar/app.ts")
	hl.exec_cmd("wlsunset -l 42.6 -L 21.1 -t 3700")
	hl.exec_cmd("swaybg -m fill -i ~/Pictures/5823615-1920x1080-desktop-hd-boy-programmer-wallpaper-image.jpg")
	hl.exec_cmd("/usr/local/bin/hp-camera-fix.sh")
	hl.exec_cmd("wl-paste --type text --watch cliphist store")
	hl.exec_cmd("elephant")
	hl.exec_cmd("hyprctl setcursor macOS 24")
end)
