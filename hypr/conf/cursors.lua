if hl.plugin.dynamic_cursors then
	hl.config({
		plugin = {
			dynamic_cursors = {
				enabled = true,
				mode = "none",
				shake = {
					enabled = true,
					threshold = 6.0,
					base = 3.0,
					speed = 4.0,
					influence = 0.0,
					limit = 0.0,
					timeout = 2000,
					effects = false,
				},
			},
		},
	})
end
