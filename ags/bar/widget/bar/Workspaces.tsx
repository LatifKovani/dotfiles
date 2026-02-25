import Hyprland from "gi://AstalHyprland"
import { createBinding } from "ags"

export default function Workspaces() {
  const hypr = Hyprland.get_default()
  const focusedWorkspace = createBinding(hypr, "focusedWorkspace")

  return (
    <box cssClasses={["workspaces"]} spacing={4}>
      {[1, 2, 3, 4, 5].map((id) => (
        <button
          cssClasses={focusedWorkspace((f) =>
            f?.id === id ? ["ws-btn", "active"] : ["ws-btn"],
          )}
          onClicked={() => hypr.dispatch("workspace", String(id))}
          label={String(id)}
        />
      ))}
    </box>
  )
}
