import { Gtk } from "ags/gtk4"
import { createState } from "ags"

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function Calendar() {
  const now = new Date()
  const todayY = now.getFullYear()
  const todayM = now.getMonth()
  const todayD = now.getDate()

  let curYear = todayY
  let curMonth = todayM

  const [title, setTitle] = createState(`${MONTHS[curMonth]} ${curYear}`)

  let gridRef: Gtk.Box | null = null

  function renderGrid() {
    const self = gridRef
    if (!self) return

    let child = self.get_first_child()
    while (child) {
      const next = child.get_next_sibling()
      self.remove(child)
      child = next
    }

    const daysInMonth = getDaysInMonth(curYear, curMonth)
    const firstDay = getFirstDayOfWeek(curYear, curMonth)
    const weeks: (number | null)[][] = []
    let week: (number | null)[] = []

    for (let i = 0; i < firstDay; i++) week.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d)
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }
    while (week.length < 7 && week.length > 0) week.push(null)
    if (week.length) weeks.push(week)

    for (const w of weeks) {
      const rowBox = new Gtk.Box({ spacing: 2, homogeneous: true })
      rowBox.add_css_class("cal-week")
      for (const d of w) {
        const isToday =
          d !== null &&
          curYear === todayY &&
          curMonth === todayM &&
          d === todayD
        const lbl = new Gtk.Label({
          label: d ? String(d) : "",
          halign: Gtk.Align.CENTER,
          hexpand: true,
        })
        lbl.add_css_class("cal-day")
        if (isToday) lbl.add_css_class("today")
        else if (!d) lbl.add_css_class("empty")
        rowBox.append(lbl)
      }
      self.append(rowBox)
    }
  }

  function goToPrev() {
    if (curMonth === 0) {
      curMonth = 11
      curYear--
    } else curMonth--
    setTitle(`${MONTHS[curMonth]} ${curYear}`)
    renderGrid()
  }

  function goToNext() {
    if (curMonth === 11) {
      curMonth = 0
      curYear++
    } else curMonth++
    setTitle(`${MONTHS[curMonth]} ${curYear}`)
    renderGrid()
  }

  return (
    <box
      cssClasses={["dash-section"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={12}
    >
      <box cssClasses={["cal-header"]}>
        <button cssClasses={["cal-nav-btn"]} label="󰍞" onClicked={goToPrev} />
        <label
          cssClasses={["cal-title"]}
          hexpand
          halign={Gtk.Align.CENTER}
          label={title}
        />
        <button cssClasses={["cal-nav-btn"]} label="󰍟" onClicked={goToNext} />
      </box>

      <box cssClasses={["cal-daynames"]} spacing={0}>
        {DAYS.map((d) => (
          <label
            cssClasses={["cal-dayname"]}
            label={d}
            hexpand
            halign={Gtk.Align.CENTER}
          />
        ))}
      </box>

      <box
        cssClasses={["cal-grid"]}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={2}
        $={(self: Gtk.Box) => {
          gridRef = self
          renderGrid()
        }}
      />
    </box>
  )
}
