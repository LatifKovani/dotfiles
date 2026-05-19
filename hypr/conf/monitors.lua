-- ~/.config/hypr/conf/monitors.lua

-- Laptop display
hl.monitor({
	output = "eDP-1",
	mode = "1920x1080@60",
	position = "0x0",
	scale = 1,
})

-- External monitor (extend)
hl.monitor({
	output = "HDMI-A-1",
	mode = "preferred",
	position = "auto",
	scale = 1,
})

-- Mirror variant — swap the above with this if you want to mirror:
-- hl.monitor({ output = "HDMI-A-1", mode = "preferred", position = "auto", scale = 1, mirror = "eDP-1" })
