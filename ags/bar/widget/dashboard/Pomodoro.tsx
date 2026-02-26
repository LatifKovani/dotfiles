import { Gtk } from "ags/gtk4"
import { createState } from "ags"
import GLib from "gi://GLib"
import { notify } from "../notify"

type Mode = "work" | "short" | "long"

export default function Pomodoro() {
  // All mutable state lives as plain JS vars — no .get() needed
  let curMode: Mode = "work"
  let curWorkMins = 90
  let curShortMins = 10
  let curLongMins = 20
  let curSeconds = 90 * 60
  let tickId: number | null = null
  let curSessions = 0
  let curEditing = false
  let curRunning = false

  // Reactive display state
  const [mode, setMode] = createState<Mode>("work")
  const [seconds, setSeconds] = createState(curSeconds)
  const [running, setRunning] = createState(false)
  const [sessions, setSessions] = createState(0)
  const [editing, setEditing] = createState(false)
  const [workMins, setWorkMins] = createState(curWorkMins)
  const [shortMins, setShortMins] = createState(curShortMins)
  const [longMins, setLongMins] = createState(curLongMins)

  function fmt(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  }

  function stopTick() {
    if (tickId !== null) {
      GLib.source_remove(tickId)
      tickId = null
    }
  }

  function stop() {
    stopTick()
    curRunning = false
    setRunning(false)
  }

  function reset() {
    stop()
    if (curMode === "work") curSeconds = curWorkMins * 60
    else if (curMode === "short") curSeconds = curShortMins * 60
    else curSeconds = curLongMins * 60
    setSeconds(curSeconds)
  }

  function switchMode(m: Mode) {
    stop()
    curMode = m
    setMode(m)
    if (m === "work") curSeconds = curWorkMins * 60
    else if (m === "short") curSeconds = curShortMins * 60
    else curSeconds = curLongMins * 60
    setSeconds(curSeconds)
  }

  function start() {
    if (curRunning) return
    curRunning = true
    setRunning(true)

    tickId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
      curSeconds -= 1
      setSeconds(curSeconds)

      if (curSeconds <= 0) {
        curSeconds = 0
        setSeconds(0)
        curRunning = false
        setRunning(false)
        tickId = null

        if (curMode === "work") {
          curSessions += 1
          setSessions(curSessions)
          notify({
            appName: "Pomodoro",
            summary: "Session complete!",
            body: "Time for a break.",
            urgency: 1,
          })
        } else {
          notify({
            appName: "Pomodoro",
            summary: "Break over!",
            body: "Back to work.",
            urgency: 1,
          })
        }
        return GLib.SOURCE_REMOVE
      }
      return GLib.SOURCE_CONTINUE
    })
  }

  function adjWork(delta: number) {
    curWorkMins = Math.max(1, Math.min(180, curWorkMins + delta))
    setWorkMins(curWorkMins)
    if (curMode === "work") {
      curSeconds = curWorkMins * 60
      setSeconds(curSeconds)
    }
  }

  function adjShort(delta: number) {
    curShortMins = Math.max(1, Math.min(60, curShortMins + delta))
    setShortMins(curShortMins)
    if (curMode === "short") {
      curSeconds = curShortMins * 60
      setSeconds(curSeconds)
    }
  }

  function adjLong(delta: number) {
    curLongMins = Math.max(1, Math.min(60, curLongMins + delta))
    setLongMins(curLongMins)
    if (curMode === "long") {
      curSeconds = curLongMins * 60
      setSeconds(curSeconds)
    }
  }

  return (
    <box
      cssClasses={["dash-section"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={16}
    >
      {/* Title + session count */}
      <box>
        <label
          cssClasses={["dash-section-title"]}
          label="POMODORO"
          hexpand
          halign={Gtk.Align.START}
        />
        <label
          cssClasses={["pomo-sessions"]}
          label={sessions((s: number) => `${s} sessions`)}
        />
      </box>

      {/* Mode tabs */}
      <box cssClasses={["pomo-tabs"]} spacing={4} homogeneous>
        {(["work", "short", "long"] as Mode[]).map((m) => (
          <button
            cssClasses={mode((cur: Mode) =>
              cur === m ? ["pomo-tab", "active"] : ["pomo-tab"],
            )}
            onClicked={() => switchMode(m)}
            label={m === "work" ? "Work" : m === "short" ? "Short" : "Long"}
          />
        ))}
      </box>

      {/* Big timer */}
      <label
        cssClasses={["pomo-timer"]}
        label={seconds((s: number) => fmt(s))}
        halign={Gtk.Align.CENTER}
      />

      {/* Session dots */}
      <box halign={Gtk.Align.CENTER} spacing={8}>
        {[0, 1, 2, 3].map((i) => (
          <label
            cssClasses={sessions((s: number) =>
              s % 4 > i ? ["pomo-dot", "filled"] : ["pomo-dot"],
            )}
            label="●"
          />
        ))}
      </box>

      {/* Buttons */}
      <box spacing={8} halign={Gtk.Align.CENTER}>
        <button
          cssClasses={running((r: boolean) =>
            r ? ["pomo-btn", "pomo-btn-pause"] : ["pomo-btn", "pomo-btn-start"],
          )}
          label={running((r: boolean) => (r ? "  Pause" : "  Start"))}
          onClicked={() => {
            if (curRunning) stop()
            else start()
          }}
        />
        <button
          cssClasses={["pomo-btn", "pomo-btn-reset"]}
          label="  Reset"
          onClicked={reset}
        />
        <button
          cssClasses={editing((e: boolean) =>
            e
              ? ["pomo-btn", "pomo-btn-edit", "active"]
              : ["pomo-btn", "pomo-btn-edit"],
          )}
          label="󰏫"
          onClicked={() => {
            curEditing = !curEditing
            setEditing(curEditing)
          }}
        />
      </box>

      {/* Duration editor */}
      <box orientation={Gtk.Orientation.VERTICAL} spacing={6} visible={editing}>
        <box cssClasses={["pomo-edit-row"]} spacing={8}>
          <label
            cssClasses={["pomo-edit-label"]}
            label="Work"
            hexpand
            halign={Gtk.Align.START}
          />
          <button
            cssClasses={["pomo-edit-btn"]}
            label="−"
            onClicked={() => adjWork(-5)}
          />
          <label
            cssClasses={["pomo-edit-val"]}
            label={workMins((v: number) => `${v}m`)}
            halign={Gtk.Align.CENTER}
          />
          <button
            cssClasses={["pomo-edit-btn"]}
            label="+"
            onClicked={() => adjWork(5)}
          />
        </box>
        <box cssClasses={["pomo-edit-row"]} spacing={8}>
          <label
            cssClasses={["pomo-edit-label"]}
            label="Short break"
            hexpand
            halign={Gtk.Align.START}
          />
          <button
            cssClasses={["pomo-edit-btn"]}
            label="−"
            onClicked={() => adjShort(-1)}
          />
          <label
            cssClasses={["pomo-edit-val"]}
            label={shortMins((v: number) => `${v}m`)}
            halign={Gtk.Align.CENTER}
          />
          <button
            cssClasses={["pomo-edit-btn"]}
            label="+"
            onClicked={() => adjShort(1)}
          />
        </box>
        <box cssClasses={["pomo-edit-row"]} spacing={8}>
          <label
            cssClasses={["pomo-edit-label"]}
            label="Long break"
            hexpand
            halign={Gtk.Align.START}
          />
          <button
            cssClasses={["pomo-edit-btn"]}
            label="−"
            onClicked={() => adjLong(-1)}
          />
          <label
            cssClasses={["pomo-edit-val"]}
            label={longMins((v: number) => `${v}m`)}
            halign={Gtk.Align.CENTER}
          />
          <button
            cssClasses={["pomo-edit-btn"]}
            label="+"
            onClicked={() => adjLong(1)}
          />
        </box>
      </box>
    </box>
  )
}
