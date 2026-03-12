import Hyprland from "gi://AstalHyprland"
import { createBinding } from "ags"

export default function Workspaces() {
  const hypr = Hyprland.get_default()
  const focusedWorkspace = createBinding(hypr, "focusedWorkspace")

  return (
    <box cssClasses={["workspaces"]}>
      {[1, 2, 3, 4, 5].map((id) => (
        <button
          cssClasses={focusedWorkspace((f) =>
            f?.id === id ? ["ws-dot", "active"] : ["ws-dot"],
          )}
          onClicked={() => hypr.dispatch("workspace", String(id))}
        >
          <label
            cssClasses={["ws-dot-label"]}
            label={String(id)}
            visible={focusedWorkspace((f) => f?.id === id)}
          />
        </button>
      ))}
    </box>
  )
}
