import './agenda.css';
import { useMemo, useState } from 'react';

type EventStatus = 'planifié' | 'en_redaction' | 'pret';

interface AgendaEvent {
  id: number;
  title: string;
  date: string; 
  status: EventStatus;
}

const STATIC_AGENDA_EVENTS: AgendaEvent[] = [
  { id: 1, title: 'Rentrée scolaire Occitanie', date: '2026-07-18', status: 'pret' },
  { id: 2, title: 'Interview maire — tramway', date: '2026-07-20', status: 'en_redaction' },
  { id: 3, title: 'Festival d\'été régional', date: '2026-07-23', status: 'planifié' },
  { id: 4, title: 'Agriculture locale', date: '2026-07-23', status: 'planifié' },
  { id: 5, title: 'Reportage marché bio', date: '2026-07-23', status: 'planifié' },
  { id: 6, title: 'Manifestation étudiante', date: '2026-07-14', status: 'pret' },
  { id: 7, title: 'Plan vélo métropolitain', date: '2026-07-12', status: 'en_redaction' },
  { id: 8, title: 'Ouverture marché de Noël', date: '2026-07-10', status: 'pret' },
];

const STATUS_BADGE_CLASS: Record<EventStatus, string> = {
  planifié: 'badge-planifie',
  en_redaction: 'badge-redaction',
  pret: 'badge-pret',
};

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const MAX_EVENTS_PER_DAY = 2;

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function AgendaPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1)); 

  const eventsByDate = useMemo(() => {
    const map: Record<string, AgendaEvent[]> = {};
    STATIC_AGENDA_EVENTS.forEach((event) => {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    });
    return map;
  }, []);

  const gridDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    // Lundi = 0 ... Dimanche = 6
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
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return (
    <div className="page">
      <div className="agenda-header">
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Agenda éditorial</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Planning des publications</p>
        </div>
        <button className="agenda-today-btn" onClick={goToToday}>
          Aujourd'hui
        </button>
      </div>

      <div className="card">
        <div className="agenda-nav" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
          <button className="agenda-nav-btn" onClick={goToPreviousMonth} aria-label="Mois précédent">
            ‹
          </button>
          <span className="agenda-month-label">
            {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button className="agenda-nav-btn" onClick={goToNextMonth} aria-label="Mois suivant">
            ›
          </button>
        </div>

        <div className="calendar-weekdays">
          {WEEKDAYS.map((day) => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-month-grid">
          {gridDays.map((day) => {
            const dateKey = toDateKey(day);
            const dayEvents = eventsByDate[dateKey] || [];
            const outsideMonth = day.getMonth() !== currentMonth.getMonth();
            const isToday = isSameDay(day, today);

            return (
              <div
                key={dateKey}
                className={`calendar-day-cell ${outsideMonth ? 'outside-month' : ''} ${isToday ? 'is-today' : ''}`}
              >
                <span className="calendar-day-number">{day.getDate()}</span>
                <div className="calendar-day-events">
                  {dayEvents.slice(0, MAX_EVENTS_PER_DAY).map((event) => (
                    <span
                      key={event.id}
                      className={`calendar-event-pill ${STATUS_BADGE_CLASS[event.status]}`}
                      title={event.title}
                    >
                      {event.title}
                    </span>
                  ))}
                  {dayEvents.length > MAX_EVENTS_PER_DAY && (
                    <span className="calendar-more-count">
                      +{dayEvents.length - MAX_EVENTS_PER_DAY} autre{dayEvents.length - MAX_EVENTS_PER_DAY > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
