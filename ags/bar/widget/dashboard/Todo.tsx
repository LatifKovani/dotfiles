import { Gtk } from "ags/gtk4"
import GLib from "gi://GLib"

const TODO_FILE = `${GLib.get_user_config_dir()}/ags/bar/todos.json`

interface Task {
  id: number
  text: string
  done: boolean
}

function loadTasks(): Task[] {
  try {
    const [ok, data] = GLib.file_get_contents(TODO_FILE)
    if (ok && data) {
      const parsed = JSON.parse(new TextDecoder().decode(data))
      if (Array.isArray(parsed)) return parsed
    }
  } catch (_) { }
  return []
}

function saveTasks(tasks: Task[]) {
  try {
    GLib.mkdir_with_parents(GLib.path_get_dirname(TODO_FILE), 0o755)
    GLib.file_set_contents(
      TODO_FILE,
      new TextEncoder().encode(JSON.stringify(tasks)),
    )
  } catch (_) { }
}

export default function Todo() {
  // All state is local to this function call — no module-level vars
  let tasks: Task[] = loadTasks()
  let nextId =
    tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : Date.now()

  let entryRef: Gtk.Entry | null = null
  let listBoxRef: Gtk.Box | null = null
  let countLabelRef: Gtk.Label | null = null

  function updateCount() {
    if (countLabelRef)
      countLabelRef.set_label(
        `${tasks.filter((x) => !x.done).length} remaining`,
      )
  }

  function rebuildList() {
    const self = listBoxRef
    if (!self) return

    // Clear
    let child = self.get_first_child()
    while (child) {
      const next = child.get_next_sibling()
      self.remove(child)
      child = next
    }

    if (tasks.length === 0) {
      const empty = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 6,
        halign: Gtk.Align.CENTER,
      })
      empty.add_css_class("todo-empty")
      const icon = new Gtk.Label({ label: "󰄲" })
      icon.add_css_class("todo-empty-icon")
      const lbl = new Gtk.Label({ label: "No tasks yet" })
      lbl.add_css_class("todo-empty-label")
      empty.append(icon)
      empty.append(lbl)
      self.append(empty)
      updateCount()
      return
    }

    for (const task of tasks) {
      const id = task.id // capture for closure

      const row = new Gtk.Box({ spacing: 10 })
      row.add_css_class("todo-item")
      if (task.done) row.add_css_class("done")

      const check = new Gtk.Button({ label: task.done ? "󰄵" : "󰄱" })
      check.add_css_class("todo-check")
      if (task.done) check.add_css_class("checked")
      check.connect("clicked", () => {
        tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        saveTasks(tasks)
        rebuildList()
      })

      const text = new Gtk.Label({
        label: task.text,
        hexpand: true,
        halign: Gtk.Align.START,
        xalign: 0,
        wrap: true,
        max_width_chars: 22,
      })
      text.add_css_class("todo-text")
      if (task.done) text.add_css_class("done")

      const del = new Gtk.Button({ label: "󰅖" })
      del.add_css_class("todo-del-btn")
      del.connect("clicked", () => {
        tasks = tasks.filter((t) => t.id !== id)
        saveTasks(tasks)
        rebuildList()
      })

      row.append(check)
      row.append(text)
      row.append(del)
      self.append(row)
    }

    updateCount()
  }

  function addTask(text: string): boolean {
    const t = text.trim()
    if (!t) return false
    tasks = [...tasks, { id: nextId++, text: t, done: false }]
    saveTasks(tasks)
    rebuildList()
    return true
  }

  return (
    <box
      cssClasses={["dash-section", "todo-section"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={12}
    >
      <box>
        <label
          cssClasses={["dash-section-title"]}
          label="TASKS"
          hexpand
          halign={Gtk.Align.START}
        />
        <label
          cssClasses={["todo-count"]}
          label="0 remaining"
          $={(self: Gtk.Label) => {
            countLabelRef = self
            updateCount()
          }}
        />
      </box>

      <box cssClasses={["todo-input-row"]} spacing={8}>
        <entry
          cssClasses={["todo-input"]}
          hexpand
          placeholderText="Add a task..."
          $={(self: Gtk.Entry) => {
            entryRef = self
            self.connect("activate", () => {
              if (addTask(self.get_text())) self.set_text("")
            })
          }}
        />
        <button
          cssClasses={["todo-add-btn"]}
          label="󰐕"
          onClicked={() => {
            if (entryRef && addTask(entryRef.get_text())) entryRef.set_text("")
          }}
        />
      </box>

      <scrolledwindow
        cssClasses={["todo-scroll"]}
        vexpand
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
        heightRequest={180}
      >
        <box
          orientation={Gtk.Orientation.VERTICAL}
          spacing={6}
          $={(self: Gtk.Box) => {
            listBoxRef = self
            rebuildList()
          }}
        />
      </scrolledwindow>
    </box>
  )
}
