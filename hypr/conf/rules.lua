-- ~/.config/hypr/conf/rules.lua
-- Layer rules for bars, launchers, notifications, etc.

-- AGS bar (gtk-layer-shell)
hl.layer_rule({ name = "ags-blur", match = { namespace = "gtk-layer-shell" }, blur = true, ignore_alpha = 0.3 })
hl.layer_rule({ name = "ags-nc", match = { namespace = "gtk-layer-shell" }, ignore_alpha = 0.1 })

-- Dashboard
hl.layer_rule({ name = "dashboard-blur", match = { namespace = "dashboard" }, blur = true, ignore_alpha = 0.1 })

-- Notification centre
hl.layer_rule({ name = "nc-blur", match = { namespace = "notification-center" }, blur = true, ignore_alpha = 0.3 })

hl.layer_rule({ name = "powermenu-blur", match = { namespace = "powermenu" }, blur = true, ignore_alpha = 0.1 })

-- Rofi launcher
hl.layer_rule({ name = "rofi-blur", match = { namespace = "rofi" }, blur = true, ignore_alpha = 0.1 })
