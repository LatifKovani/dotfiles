-- ~/.config/hypr/hyprland.lua
-- Migrated from hyprlang to Lua (Hyprland 0.55+)
-- https://wiki.hypr.land/Configuring/Start/

--------------------
---- MONITORS ----
--------------------

hl.monitor({
	output = "eDP-1",
	mode = "1920x1080@60",
	position = "0x0",
	scale = 1,
})

hl.monitor({
	output = "HDMI-A-1",
	mode = "preferred",
	position = "auto",
	scale = 1,
})

-- Mirror variant (comment the above HDMI line and uncomment this to mirror):
-- hl.monitor({ output = "HDMI-A-1", mode = "preferred", position = "auto", scale = 1, mirror = "eDP-1" })

--------------------
---- AUTOSTART ----
--------------------

hl.on("hyprland.start", function()
	hl.exec_cmd("bash ~/.config/hypr/xdg-portal-hyprland")
	hl.exec_cmd("dbus-update-activation-environment --systemd WAYLAND_DISPLAY XDG_CURRENT_DESKTOP")
	hl.exec_cmd("systemctl --user import-environment WAYLAND_DISPLAY XDG_CURRENT_DESKTOP")
	hl.exec_cmd("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")
	hl.exec_cmd("hypridle")
	hl.exec_cmd("ags run ~/.config/ags/bar/app.ts")
	hl.exec_cmd("wlsunset -l 42.6 -L 21.1 -t 3700")
	hl.exec_cmd("swaybg -m fill -i ~/Pictures/wallpapers-20260227T220110Z-1-001/Monterey-dark.jpg")
	hl.exec_cmd("/usr/local/bin/hp-camera-fix.sh")
	hl.exec_cmd("wl-paste --type text --watch cliphist store")
	hl.exec_cmd("elephant")
	hl.exec_cmd("hyprctl setcursor macOS 24")
end)

--------------------------
---- LOOK AND FEEL ----
--------------------------

hl.config({
	general = {
		gaps_in = 2,
		gaps_out = { top = 2, right = 0, bottom = 0, left = 0 },
		border_size = 1,
		col = {
			active_border = "rgba(ECEFF460)",
			inactive_border = "rgba(595959aa)",
		},
		layout = "scrolling",
	},

	decoration = {
		rounding = 17,
		blur = {
			enabled = true,
			size = 12,
			passes = 3,
			ignore_opacity = true,
			contrast = 2,
			xray = false,
			vibrancy = 0,
			new_optimizations = true,
			brightness = 0.8,
		},
	},

	animations = {
		enabled = true,
	},

	input = {
		kb_layout = "us",
		kb_variant = "",
		kb_model = "",
		kb_options = "",
		kb_rules = "",
		follow_mouse = 1,
		sensitivity = 0,
		touchpad = {
			natural_scroll = true,
		},
	},

	scrolling = {
		column_width = 0.6,
		fullscreen_on_one_column = true,
		explicit_column_widths = "0.5 0.67 0.8 1.0",
		follow_focus = true,
		focus_fit_method = 1,
		follow_min_visible = 0,
	},

	misc = {
		disable_hyprland_logo = true,
	},

	dwindle = {
		preserve_split = true,
		-- Note: pseudotile has been removed in 0.55
	},
})

----------------------
---- ANIMATIONS ----
----------------------

hl.curve("myBezier", { type = "bezier", points = { { 0.05, 0.9 }, { 0.1, 1.05 } } })

hl.animation({ leaf = "windows", enabled = true, speed = 7, bezier = "myBezier" })
hl.animation({ leaf = "windowsIn", enabled = true, speed = 7, bezier = "myBezier", style = "gnomed" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 7, bezier = "myBezier", style = "slide" })
hl.animation({ leaf = "border", enabled = true, speed = 10, bezier = "default" })
hl.animation({ leaf = "borderangle", enabled = true, speed = 8, bezier = "default" })
hl.animation({ leaf = "fade", enabled = true, speed = 7, bezier = "default" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 6, bezier = "myBezier", style = "fade" })
hl.animation({ leaf = "layersIn", enabled = true, speed = 7, bezier = "myBezier", style = "fade" })
hl.animation({ leaf = "layersOut", enabled = true, speed = 7, bezier = "myBezier", style = "fade" })

-----------------------
---- LAYER RULES ----
-----------------------

-- gtk-layer-shell (AGS bar)
hl.layer_rule({ name = "ags-blur", match = { namespace = "gtk-layer-shell" }, blur = true, ignore_alpha = 0.3 })
hl.layer_rule({ name = "ags-nc", match = { namespace = "gtk-layer-shell" }, ignore_alpha = 0.1 })

-- Dashboard
hl.layer_rule({
	name = "dashboard-blur",
	match = { namespace = "dashboard" },
	blur = true,
	ignore_alpha = 0.1,
})

-- Notification centre
hl.layer_rule({
	name = "nc-blur",
	match = { namespace = "notification-center" },
	blur = true,
	ignore_alpha = 0.3,
})

-- Rofi
hl.layer_rule({
	name = "rofi-blur",
	match = { namespace = "rofi" },
	blur = true,
	ignore_alpha = 0.1,
})

-------------------
---- BINDS ----
-------------------

local mainMod = "SUPER"

-- App shortcuts
local fileManager = "nautilus"
local appLauncher = "rofi -show drun"
local terminal = "kitty"
local browser = "brave"
local logout = "bash ~/.config/rofi/powermenu/powermenu.sh"
local office = "onlyoffice-desktopeditors"
local lockScreen = "hyprlock"
local notifCentre = "ags request 'toggleNc' -i bar"
local nightMode = "~/.local/bin/toggle-wlsunset.fish"
local screenPrint =
	'grim -g "$(slurp)" /tmp/screenshot.png && wl-copy --type image/png < /tmp/screenshot.png && satty --filename /tmp/screenshot.png'
local windowShot =
	"sleep 0.3 && grim /tmp/screenshot.png && wl-copy --type image/png < /tmp/screenshot.png && satty --filename /tmp/screenshot.png"
local clipHistory = "cliphist list | rofi -dmenu -display-columns 2 | cliphist decode | wl-copy"
local clearClipboard = "cliphist wipe"
local dashboard = "ags request toggleDashboard -i bar"
local nmsurf = "nmsurf"

-- App binds
-- ~/.config/hypr/hyprland.lua
-- Entry point — loads all modules from the conf/ directory

require("conf/monitors")
require("conf/autostart")
require("conf/settings")
require("conf/animations")
require("conf/rules")
require("conf/binds")
