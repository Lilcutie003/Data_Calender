import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { selectDate } from "../redux/calenderSlice";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const formatDateKey = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function CalendarComponent() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.calendar.events);
  const selectedDate = useSelector((state) => state.calendar.selectedDate);
console.log("Redux events:", data);
console.log("Selected date:", useSelector((state) => state.calendar.selectedDate));

const { events, highlightedDates } = useMemo(() => {
  const eventList = [];
  const highlightSet = new Set();

  Object.keys(data).forEach((dateStr) => {
    const [day, month, year] = dateStr.split("-").map(Number);

    data[dateStr].forEach((entry) => {
      const startTime = new Date(year, month - 1, day, entry.startHour, entry.startMinute);
      const endTime = new Date(year, month - 1, day, entry.endHour, entry.endMinute);
console.log('entry',entry);

      eventList.push({
        title: `${entry.user}: ${entry.value}`,
        start: startTime,
        end: endTime,
        allDay: false,
      });

      highlightSet.add(new Date(year, month - 1, day).toDateString());
    });
  });

  return { events: eventList, highlightedDates: highlightSet };
}, [data]);


  const dayPropGetter = (date) => {
    const dateStr = date.toDateString();
    if (selectedDate) {
      const [day, month, year] = selectedDate.split("-").map(Number);
      const selectedDateObj = new Date(year, month - 1, day);
      if (dateStr === selectedDateObj.toDateString()) {
        return {
          style: {
            backgroundColor: "#8ce5e8ff",
            color: "#fff",
            border: "2px solid #a5e4f5ff",
            cursor: "pointer",
            borderRadius: "6px",
          },
        };
      }
    }
    if (highlightedDates.has(dateStr)) {
      return {
        style: {
          backgroundColor: "#fff6a8",
          border: "2px solid #b6a200",
          cursor: "pointer",
          borderRadius: "6px",
        },
      };
    }

    return {};
  };

  const handleSelect = (value) => {
    let selected;
    if (value.start) {
      selected = formatDateKey(value.start);
    } else {
      selected = formatDateKey(value);
    }
    dispatch(selectDate(selected));
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      selectable
      defaultView="month"
      views={["month", "week", "day"]}
      dayPropGetter={dayPropGetter}
      style={{ height: 500, margin: "20px" }}
      onSelectEvent={handleSelect}
      onSelectSlot={(slotInfo) => handleSelect(slotInfo)}
    />
  );
}
