import "../style/agenda.css";
import { useMemo, useState } from "react";
import type { agenda } from "../types";
import NouvelEvenementModal from "../composants/NouvelEvenementModal";
import EvenementDetailModal from "../composants/EvenementDetailModal";
import { useEvents, useCreateEvent } from "../data/agendaData";
import ListeEvents from "../composants/ListeEvents";
const IMPORTANCE_BADGE_CLASS: Record<string, string> = {
  Faible: "badge-faible",
  Moyenne: "badge-moyenne",
  Forte: "badge-forte",
};

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const MAX_EVENTS_PER_DAY = 2;

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Toutes les dates (une par jour, à minuit) entre deux dates, bornes incluses.
function getDateRange(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const cursor = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  while (cursor.getTime() <= last.getTime()) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function getEventsForDate(events: agenda[], selectedDate: Date | null) {
  if (!selectedDate) return [];
  return events.filter((event) => {
    const eventDate = event.dateDebut;
    const enventFinDate = event.dateFin;
    return (
      ((eventDate.getFullYear() <= selectedDate.getFullYear()) && (enventFinDate.getFullYear() >= selectedDate.getFullYear()) ) &&
      ((eventDate.getMonth() <= selectedDate.getMonth()) && (enventFinDate.getMonth() >= selectedDate.getMonth()) ) &&
      ((eventDate.getDate() <= selectedDate.getDate()) && (enventFinDate.getDate() >= selectedDate.getDate()) )
    );
  });
}

export default function AgendaPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<agenda | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<agenda[] | null>(null);
  const { events, loading, error } = useEvents();
  const [createEvent] = useCreateEvent();

  const eventsConvertis = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        dateDebut: new Date(event.dateDebut),
        dateFin: new Date(event.dateFin),
      })) as agenda[],
    [events],
  );
  const filteredEvents = getEventsForDate(eventsConvertis, selectedDate);

  const eventsByDate = useMemo(() => {
    const map: Record<string, agenda[]> = {};
    eventsConvertis.forEach((event) => {
      getDateRange(event.dateDebut, event.dateFin).forEach((day) => {
        const dateKey = toDateKey(day);
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(event);
      });
    });
    return map;
  }, [eventsConvertis]);

  const highlightedDateKeys = useMemo(() => {
    if (!selectedEvent) return new Set<string>();
    const debut = new Date(selectedEvent.dateDebut);
    const fin = new Date(selectedEvent.dateFin);
    return new Set(getDateRange(debut, fin).map(toDateKey));
  }, [selectedEvent]);

  const gridDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7;

    const gridStart = new Date(year, month, 1 - startOffset);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentMonth]);

  const today = new Date();

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate((prev) => (prev && isSameDay(prev, day) ? null : day));
    setSelectedEvents(getEventsForDate(eventsConvertis, day));
  };

  const openModalForDate = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEventClick = (event: agenda, e: React.MouseEvent) => {
    e.stopPropagation(); // ne pas déclencher aussi la sélection du jour
    setSelectedEvent(event);
  };

  const handleCloseEventDetail = () => {
    setSelectedEvent(null);
  };

  const handleSaveEvent = async (
    newEvent: Omit<agenda, "id" | "source"> & { sourceId: number },
  ) => {
    await createEvent({
      variables: {
        createAgendaInput: newEvent,
      },
    });
    setCurrentMonth(
      new Date(
        newEvent.dateDebut.getFullYear(),
        newEvent.dateDebut.getMonth(),
        1,
      ),
    );
    setIsModalOpen(false);
  };

  if (loading) return <div className="page">Chargement des eveneemnts...</div>;
  if (error)
    return (
      <div className="page">
        Erreur lors du chargement des eveneemnts : {error.message}
      </div>
    );
  return (
    <div className="page">
      <div className="agenda-header">
        <div>
          <h1 className="agenda-title">Agenda éditorial</h1>
          <p className="agenda-subtitle">Planning des publications</p>
        </div>
        <div className="agenda-header-actions">
          <button className="agenda-today-btn" onClick={goToToday}>
            Aujourd'hui
          </button>
          <button className="agenda-add-btn" onClick={handleOpenModal}>
            <span className="agenda-add-btn-icon">+</span>
            Nouvel événement
          </button>
        </div>
      </div>

      {selectedDate && (
        <div className="agenda-selected-date-bar">
          <span>
            Date sélectionnée :{" "}
            <strong>
              {selectedDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </strong>
          </span>
          <div className="agenda-selected-date-actions">
            <button
              className="agenda-selected-date-add"
              onClick={() => openModalForDate(selectedDate)}
            >
              Ajouter un événement ce jour
            </button>
            <button
              className="agenda-selected-date-clear"
              onClick={() => setSelectedDate(null)}
              aria-label="Effacer la sélection"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="agenda-nav">
          <button
            className="agenda-nav-btn"
            onClick={goToPreviousMonth}
            aria-label="Mois précédent"
          >
            ‹
          </button>
          <span className="agenda-month-label">
            {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            className="agenda-nav-btn"
            onClick={goToNextMonth}
            aria-label="Mois suivant"
          >
            ›
          </button>
        </div>

        <div className="calendar-weekdays">
          {WEEKDAYS.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-month-grid">
          {gridDays.map((day) => {
            const dateKey = toDateKey(day);
            const dayEvents = eventsByDate[dateKey] || [];
            const outsideMonth = day.getMonth() !== currentMonth.getMonth();
            const isToday = isSameDay(day, today);
            const isSelected = !!selectedDate && isSameDay(day, selectedDate);
            const isEventHighlighted = highlightedDateKeys.has(dateKey);

            return (
              <div
                key={dateKey}
                className={`calendar-day-cell ${outsideMonth ? "outside-month" : ""} ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""} ${isEventHighlighted ? "is-event-highlighted" : ""}`}
                onClick={() => handleDayClick(day)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleDayClick(day);
                  }
                }}
              >
                <div className="calendar-day-cell-top">
                  <span className="calendar-day-number">{day.getDate()}</span>
                  <button
                    type="button"
                    className="calendar-day-quick-add"
                    aria-label={`Ajouter un événement le ${toDateKey(day)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openModalForDate(day);
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="calendar-day-events">
                  {dayEvents.slice(0, MAX_EVENTS_PER_DAY).map((event) => (
                    <span
                      key={event.id}
                      className={`calendar-event-pill ${IMPORTANCE_BADGE_CLASS[event.importance]}`}
                      title={event.title}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      {event.title}
                    </span>
                  ))}
                  {dayEvents.length > MAX_EVENTS_PER_DAY && (
                    <span className="calendar-more-count">
                      +{dayEvents.length - MAX_EVENTS_PER_DAY} autre
                      {dayEvents.length - MAX_EVENTS_PER_DAY > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <NouvelEvenementModal
          dateInitiale={selectedDate ?? today}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
        />
      )}

      {selectedEvent ? (
        <EvenementDetailModal
          evenement={selectedEvent}
          onClose={handleCloseEventDetail}
        />
      ) : selectedDate && filteredEvents.length > 1 ? (
        <ListeEvents
          evenements={filteredEvents}
          onClose={() => setSelectedDate(null)}
        />
      ) : null}
    </div>
  );
}
