import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createState } from "ags"
import { createPoll } from "ags/time"
import GLib from "gi://GLib"

export const [powerMenuOpen, setPowerMenuOpen] = createState(false)
let _open = false

export function togglePowerMenu() {
  _open = !_open
  setPowerMenuOpen(_open)
}

function close() {
  _open = false
  setPowerMenuOpen(false)
}

const buttons = [
  {
    icon: "󰌾",
    label: "Lock",
    cssClass: "powermenu-btn-lock",
    action: () => {
      close()
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 200, () => {
        GLib.spawn_command_line_async("hyprlock")
        return GLib.SOURCE_REMOVE
      })
    },
  },
  {
    icon: "󰤄",
    label: "Suspend",
    cssClass: "powermenu-btn-suspend",
    action: () => {
      close()
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 200, () => {
        GLib.spawn_command_line_async("systemctl suspend")
        return GLib.SOURCE_REMOVE
      })
    },
  },
  {
    icon: "󰍃",
    label: "Logout",
    cssClass: "powermenu-btn-logout",
    action: () => {
      close()
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 200, () => {
        GLib.spawn_command_line_async(
          "bash -c 'loginctl terminate-session $XDG_SESSION_ID'",
        )
        return GLib.SOURCE_REMOVE
      })
    },
  },
  {
    icon: "󰜉",
    label: "Reboot",
    cssClass: "powermenu-btn-reboot",
    action: () => {
      close()
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 200, () => {
        GLib.spawn_command_line_async("systemctl reboot")
        return GLib.SOURCE_REMOVE
      })
    },
  },
  {
    icon: "⏻",
    label: "Shutdown",
    cssClass: "powermenu-btn-shutdown",
    action: () => {
      close()
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 200, () => {
        GLib.spawn_command_line_async("systemctl poweroff")
        return GLib.SOURCE_REMOVE
      })
    },
  },
]

export default function PowerMenu() {
  const uptime = createPoll("", 5000, "bash -c \"uptime -p | sed 's/up //'\"")

  // Reference te butoni i parë për grab_focus
  let firstBtnRef: Gtk.Widget | null = null

  return (
    <window
      visible={powerMenuOpen}
      name="powermenu"
      namespace="powermenu"
      cssClasses={["powermenu-window"]}
      layer={Astal.Layer.OVERLAY}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.EXCLUSIVE}
      $={(self: Astal.Window) => {
        const controller = new Gtk.EventControllerKey()
        controller.connect(
          "key-pressed",
          (_ctrl: Gtk.EventControllerKey, keyval: number) => {
            if (keyval === Gdk.KEY_Escape) {
              close()
              return true
            }
            return false
          },
        )
        self.add_controller(controller)

        // Kur dritarja bëhet visible, grabo fokusin te butoni i parë
        self.connect("notify::visible", () => {
          if (self.visible) {
            GLib.timeout_add(GLib.PRIORITY_DEFAULT, 50, () => {
              firstBtnRef?.grab_focus()
              return GLib.SOURCE_REMOVE
            })
          }
        })
      }}
    >
      <box
        cssClasses={powerMenuOpen((o: boolean) =>
          o ? ["powermenu-overlay", "visible"] : ["powermenu-overlay"],
        )}
        hexpand
        vexpand
        halign={Gtk.Align.FILL}
        valign={Gtk.Align.FILL}
      >
        <box
          orientation={Gtk.Orientation.VERTICAL}
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          hexpand
          vexpand
          spacing={48}
        >
          <label
            cssClasses={["powermenu-uptime"]}
            label={uptime((u: string) => `Uptime: ${u.trim()}`)}
          />

          <box cssClasses={["powermenu-buttons"]} spacing={24}>
            {buttons.map((btn, i) => (
              <button
                cssClasses={["powermenu-btn", btn.cssClass]}
                onClicked={btn.action}
                focusable={true}
                $={(self: Gtk.Widget) => {
                  // Kap referencën e butonit të parë
                  if (i === 0) firstBtnRef = self
                }}
              >
                <box
                  orientation={Gtk.Orientation.VERTICAL}
                  spacing={12}
                  halign={Gtk.Align.CENTER}
                  valign={Gtk.Align.CENTER}
                >
                  <label cssClasses={["powermenu-btn-icon"]} label={btn.icon} />
                  <label
                    cssClasses={["powermenu-btn-label"]}
                    label={btn.label}
                  />
                </box>
              </button>
            ))}
          </box>

          <label cssClasses={["powermenu-hint"]} label="Press Esc to cancel" />
        </box>
      </box>
    </window>
  )
}
