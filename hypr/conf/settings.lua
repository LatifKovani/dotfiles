-- ~/.config/hypr/conf/settings.lua
-- General, decoration, input, layout settings

hl.config({
	general = {
		gaps_in = 6,
		gaps_out = { top = 8, right = 6, bottom = 10, left = 6 },
		border_size = 0,
		-- col = {
		-- 	active_border = "rgba(5D5C5DCC)",
		-- 	inactive_border = "rgba(595959aa)",
		-- },
		layout = "scrolling",
		resize_on_border = false,
		allow_tearing = false,
	},

	decoration = {
		rounding = 25,
		rounding_power = 10,
		active_opacity = 1.0,
		inactive_opacity = 1.0,

		blur = {
			enabled = true,
			size = 10,
			passes = 3,
			contrast = 1.5,
			vibrancy = 0.2,
			new_optimizations = true,
			brightness = 0.8,
		},
		shadow = {
			enabled = true,
			range = 28,
			render_power = 3,
			color = "0x890a0a0a",
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
