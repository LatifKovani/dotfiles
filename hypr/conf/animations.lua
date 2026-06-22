-- ~/.config/hypr/conf/animations.lua

-- Bezier curves
hl.curve("myBezier", { type = "bezier", points = { { 0.05, 0.9 }, { 0.1, 1.05 } } })
hl.curve("easeInOutQuart", { type = "bezier", points = { { 0.76, 0 }, { 0.24, 1 } } })
hl.curve("easy", { type = "spring", mass = 2, stiffness = 71.2633, dampening = 15.8273644 })
hl.curve("myLeft", { type = "bezier", points = { { 0.2, 0.9 }, { 0.4, 1.0 } } })
hl.curve("myRight", { type = "bezier", points = { { 0.8, 0.9 }, { 0.6, 1.0 } } })
hl.curve("myUp", { type = "bezier", points = { { 0.5, 0.9 }, { 0.5, 1.1 } } })
hl.curve("myDown", { type = "bezier", points = { { 0.5, 1.1 }, { 0.5, 0.9 } } })

-- Animations
hl.animation({ leaf = "windows", enabled = true, speed = 7, bezier = "myBezier" })
hl.animation({ leaf = "windowsIn", enabled = true, speed = 5, bezier = "myUp", style = "slide" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 5, bezier = "easeInOutQuart", style = "slide" })
hl.animation({ leaf = "border", enabled = true, speed = 10, bezier = "default" })
hl.animation({ leaf = "borderangle", enabled = true, speed = 8, bezier = "default" })
hl.animation({ leaf = "fade", enabled = true, speed = 4, bezier = "default" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 4, bezier = "myLeft", style = "slide" })
hl.animation({ leaf = "layersIn", enabled = true, speed = 7, bezier = "myBezier", style = "fade" })
hl.animation({ leaf = "layersOut", enabled = true, speed = 7, bezier = "myBezier", style = "fade" })
