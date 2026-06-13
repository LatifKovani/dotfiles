-- ~/.config/hypr/conf/settings.lua
-- General, decoration, input, layout settings

hl.config({
	general = {
		gaps_in = 6,
		gaps_out = { top = 8, right = 6, bottom = 10, left = 6 },
		border_size = 0,
		-- col = {
		-- 	active_border = "rgba(ECEFF460)",
		-- 	inactive_border = "rgba(595959aa)",
		-- },
		layout = "scrolling",
	},

	decoration = {
		rounding = 17,
		blur = {
			enabled = true,
			size = 9,
			passes = 3,
			ignore_opacity = true,
			contrast = 2,
			xray = false,
			vibrancy = 0,
			new_optimizations = true,
			brightness = 0.8,
		},
		shadow = {
			enabled = true,
			range = 12,
			render_power = 1,
			sharp = false,
			color = "0xcc000000",
			color_inactive = "0x66000000",
			offset = { 0, 4 },
			scale = 1.0,
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
	},
})
