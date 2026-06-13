if hl.plugin.hyprglass then
	local hg = hl.plugin.hyprglass

	hg.config({
		default_theme = "dark",
		default_preset = "liquid",
		tint_color = 0xffffff08,
		brightness = 0.95,
		dark = {
			brightness = 0.88,
			contrast = 0.95,
			saturation = 0.92,
			vibrancy = 0.25,
			vibrancy_darkness = 0.1,
			adaptive_dim = 0.25,
		},
		blur_strength = 2.8,
		blur_iterations = 4,
		refraction_strength = 0.75,
		chromatic_aberration = 0.4,
		fresnel_strength = 0.85,
		specular_strength = 0.9,
		edge_thickness = 0.055,
		lens_distortion = 0.5,
		glass_opacity = 0.92,
		layers = { enabled = 1 },
	})

	-- Preset kryesor - Liquid Glass i Apple
	hg.preset("liquid", {
		blur_strength = 2.8,
		blur_iterations = 4,
		refraction_strength = 0.75,
		chromatic_aberration = 0.4,
		fresnel_strength = 0.85,
		specular_strength = 0.9,
		edge_thickness = 0.055,
		lens_distortion = 0.2,
		glass_opacity = 0.92,
		tint_color = 0xffffff08,
		dark = {
			brightness = 0.88,
			contrast = 0.95,
			saturation = 0.92,
			vibrancy = 0.25,
			adaptive_dim = 0.25,
		},
	})

	-- Layer surfaces
	hg.layer("rofi", { preset = "liquid", mask_threshold = 0.05 })

	-- Per-window overrides
end
