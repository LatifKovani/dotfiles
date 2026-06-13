-- ~/.config/hypr/conf/binds.lua

local mainMod = "SUPER"

-- ─── App Commands ──────────────────────────────────────────────────────────────
local fileManager = "nautilus"
local terminal = "kitty"
local browser = "brave"
local office = "onlyoffice-desktopeditors"
local appLauncher = "qs ipc -p /usr/share/tide-island call tide toggleAppLauncher"
local lockScreen = "hyprlock"

local nightModeEnable = "hyprctl hyprsunset temperature 4000"
local nightModeDisable = "hyprctl hyprsunset identity"
local nightModeWarmer = "hyprctl hyprsunset temperature -500"
local nightModeCooler = "hyprctl hyprsunset temperature +500"
local powerMenu = "qs ipc -p /usr/share/tide-island call tide togglePowerMenu"
local controlCenter = "qs ipc -p /usr/share/tide-island call tide toggleControlCenter"
local expandedPlayer = "qs ipc -p /usr/share/tide-island call tide togglePlayer"
local lyrics = "qs ipc -p /usr/share/tide-island call tide showLyrics"
local customSwipe = "qs ipc -p /usr/share/tide-island call tide showCustom"
local clock = "qs ipc -p /usr/share/tide-island call tide showClock"
local screenPrint =
	'grim -g "$(slurp)" /tmp/screenshot.png && wl-copy --type image/png < /tmp/screenshot.png && satty --filename /tmp/screenshot.png'
local windowShot =
	"sleep 0.3 && grim /tmp/screenshot.png && wl-copy --type image/png < /tmp/screenshot.png && satty --filename /tmp/screenshot.png"
local clipHistory = "cliphist list | rofi -dmenu -display-columns 2 | cliphist decode | wl-copy"
local clearClipboard = "cliphist wipe"
local reloadShell = "qs ipc -p /usr/share/tide-island call tide reload"
local wallpaperPicker = "qs ipc -p /usr/share/tide-island call tide toggleWallpaperPicker"

-- ─── Apps ──────────────────────────────────────────────────────────────────────
hl.bind(mainMod .. " + Q", hl.dsp.exec_cmd(terminal))
hl.bind(mainMod .. " + B", hl.dsp.exec_cmd(browser))
hl.bind(mainMod .. " + F", hl.dsp.exec_cmd(fileManager))
hl.bind(mainMod .. " + O", hl.dsp.exec_cmd(office))

-- ─── System ────────────────────────────────────────────────────────────────────
hl.bind(mainMod .. " + SHIFT + F", hl.dsp.window.fullscreen())
hl.bind(mainMod .. " + SHIFT + X", hl.dsp.window.kill())
hl.bind(mainMod .. " + SHIFT + U", hl.dsp.exec_cmd(lockScreen))
hl.bind(mainMod .. " + SHIFT + M", hl.dsp.exit())
hl.bind(mainMod .. " + V", hl.dsp.window.float({ action = "toggle" }))
hl.bind(mainMod .. " + SPACE", hl.dsp.exec_cmd(appLauncher))
hl.bind(mainMod .. " + M", hl.dsp.exec_cmd(powerMenu))
hl.bind(mainMod .. " + R", hl.dsp.exec_cmd(controlCenter))
hl.bind(mainMod .. " + D", hl.dsp.exec_cmd(expandedPlayer))
hl.bind(mainMod .. " + SHIFT + L", hl.dsp.exec_cmd(lyrics))
hl.bind(mainMod .. " + K", hl.dsp.exec_cmd(clock))
hl.bind(mainMod .. " + I", hl.dsp.exec_cmd(customSwipe))
hl.bind(mainMod .. " + SHIFT + R", hl.dsp.exec_cmd(reloadShell))
hl.bind(mainMod .. " + SHIFT + W", hl.dsp.exec_cmd(wallpaperPicker))

-- ─── Tools ─────────────────────────────────────────────────────────────────────
hl.bind(mainMod .. " + S", hl.dsp.exec_cmd(screenPrint))
hl.bind(mainMod .. " + W", hl.dsp.exec_cmd(windowShot))
hl.bind(mainMod .. " + N", hl.dsp.exec_cmd(nightModeEnable)) -- Enable night mode (3000K)
hl.bind(mainMod .. " + SHIFT + N", hl.dsp.exec_cmd(nightModeDisable)) -- Disable night mode
hl.bind(mainMod .. " + SHIFT + B", hl.dsp.exec_cmd(nightModeWarmer)) -- Make it warmer (lower temp)
hl.bind(mainMod .. " + SHIFT + V", hl.dsp.exec_cmd(nightModeCooler)) -- Make it cooler (higher temp)
hl.bind(mainMod .. " + C", hl.dsp.exec_cmd(clipHistory))
hl.bind(mainMod .. " + SHIFT + C", hl.dsp.exec_cmd(clearClipboard))

-- ─── Layout ────────────────────────────────────────────────────────────────────
hl.bind(mainMod .. " + SHIFT + P", hl.dsp.window.pseudo())
hl.bind(mainMod .. " + J", hl.dsp.layout("togglesplit"))
hl.bind(mainMod .. " + T", hl.dsp.exec_cmd("hyprctl eval 'hl.config({ general = { layout = \"scrolling\" } })'"))
hl.bind(mainMod .. " + SHIFT + T", hl.dsp.exec_cmd("hyprctl eval 'hl.config({ general = { layout = \"dwindle\" } })'"))

-- ─── Scrolling Layout ──────────────────────────────────────────────────────────
hl.bind(mainMod .. " + period", hl.dsp.layout("move +col"))
hl.bind(mainMod .. " + comma", hl.dsp.layout("move -col"))
hl.bind(mainMod .. " + equal", hl.dsp.layout("colresize +0.1"))
hl.bind(mainMod .. " + minus", hl.dsp.layout("colresize -0.1"))
hl.bind(mainMod .. " + SHIFT + period", hl.dsp.layout("swapcol r"))
hl.bind(mainMod .. " + SHIFT + comma", hl.dsp.layout("swapcol l"))
hl.bind(mainMod .. " + SHIFT + F", hl.dsp.layout("fit active"))
hl.bind("CTRL + 1", hl.dsp.layout("movecoltoworkspace 1"))
hl.bind("CTRL + 2", hl.dsp.layout("movecoltoworkspace 2"))

-- ─── Focus (vim-style) ─────────────────────────────────────────────────────────
hl.bind(mainMod .. " + h", hl.dsp.layout("focus l"))
hl.bind(mainMod .. " + j", hl.dsp.layout("focus d"))
hl.bind(mainMod .. " + k", hl.dsp.layout("focus u"))
hl.bind(mainMod .. " + l", hl.dsp.layout("focus r"))

-- ─── Workspaces ────────────────────────────────────────────────────────────────
for i = 1, 9 do
	hl.bind(mainMod .. " + " .. i, hl.dsp.focus({ workspace = i }))
	hl.bind(mainMod .. " + SHIFT + " .. i, hl.dsp.window.move({ workspace = i }))
end
hl.bind(mainMod .. " + 0", hl.dsp.focus({ workspace = 10 }))
hl.bind(mainMod .. " + SHIFT + 0", hl.dsp.window.move({ workspace = 10 }))

-- ─── Mouse ─────────────────────────────────────────────────────────────────────
hl.bind(mainMod .. " + mouse:272", hl.dsp.window.drag(), { mouse = true })
hl.bind(mainMod .. " + mouse:273", hl.dsp.window.resize(), { mouse = true })

bind = {
	mods = { "SUPER" },
	key = "P",
	dispatcher = "exec",
	params = "qs msg qml 'island.togglePowerMenu()'",
}
-- ─── Hardware Keys ─────────────────────────────────────────────────────────────

-- ASUS keyboard backlight / ROG
hl.bind(
	"code:237",
	hl.dsp.exec_cmd("brightnessctl -d asus::kbd_backlight set 20%-"),
	{ description = "KB brightness down" }
)
hl.bind(
	"code:238",
	hl.dsp.exec_cmd("brightnessctl -d asus::kbd_backlight set 20%+"),
	{ description = "KB brightness up" }
)
hl.bind("code:210", hl.dsp.exec_cmd("asusctl led-mode -n"), { description = "KB RGB profile" })
hl.bind("code:156", hl.dsp.exec_cmd("rog-control-center"), { description = "Armory crate key" })

-- Volume
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("wpctl set-volume -l 1.0 @DEFAULT_AUDIO_SINK@ 5%+"), { locked = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"), { locked = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"), { locked = true })
hl.bind("XF86AudioMicMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SOURCE@ toggle"), { locked = true })

-- Monitor brightness
hl.bind("XF86MonBrightnessUp", hl.dsp.exec_cmd("brightnessctl set 5%+"), { locked = true, repeating = true })
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_cmd("brightnessctl set 5%-"), { locked = true, repeating = true })

-- Media
hl.bind("XF86AudioPlay", hl.dsp.exec_cmd("playerctl play-pause"), { locked = true })
hl.bind("XF86AudioNext", hl.dsp.exec_cmd("playerctl next"), { locked = true })
hl.bind("XF86AudioPrev", hl.dsp.exec_cmd("playerctl previous"), { locked = true })
