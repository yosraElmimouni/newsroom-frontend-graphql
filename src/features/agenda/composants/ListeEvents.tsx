import "../style/evenementListeModal.css";
import { useState } from "react";
import type { agenda } from "../types";
import EvenementDetailModal from "./EvenementDetailModal";

interface EvenemenListeModalProps {
  evenements: agenda[];
  onClose: () => void;
}

const IMPORTANCE_BADGE_CLASS: Record<string, string> = {
  Faible: "badge-faible",
  Moyenne: "badge-moyenne",
  Forte: "badge-forte",
};

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export default function EvenemenListeModal({
  evenements,
  onClose,
}: EvenemenListeModalProps) {
  const debut = new Date(evenements[0].dateDebut);
  const [selectedEvent, setSelectedEvent] = useState<agenda | null>(null);

  const handleEventClick = (event: agenda) => {
    setSelectedEvent(event);
  };

  const handleCloseEventDetail = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="evenement-liste-backdrop" onClick={onClose}>
      <div
        className="evenement-liste-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="evenement-liste-header">
          <div>
            <p className="evenement-liste-eyebrow">Événements du jour</p>
            <h2 className="evenement-liste-title">
              {debut.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>
          <button
            type="button"
            className="evenement-liste-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="evenement-liste-content">
          {evenements.length === 0 ? (
            <div className="evenement-liste-empty">
              Aucun événement ne correspond à votre recherche.
            </div>
          ) : (
            <div className="evenement-liste-cards">
              {evenements.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => handleEventClick(event)}
                  className="evenement-liste-card"
                >
                  <div className="evenement-liste-card-top">
                    <h3 className="evenement-liste-card-title">
                      {event.title}
                    </h3>
                    <span
                      className={`evenement-liste-badge ${IMPORTANCE_BADGE_CLASS[event.importance]}`}
                    >
                      {event.importance}
                    </span>
                  </div>
                  <div className="evenement-liste-card-date">
                    <CalendarIcon />
                    <span>
                      {new Date(event.dateDebut).toLocaleDateString("fr-FR")}
                      {event.dateFin &&
                        ` → ${new Date(event.dateFin).toLocaleDateString("fr-FR")}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>


        <div className="evenement-liste-footer">
          <button
            type="button"
            className="evenement-liste-footer-btn"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>

      {selectedEvent && (
        <EvenementDetailModal
          evenement={selectedEvent}
          onClose={handleCloseEventDetail}
        />
      )}
    </div>
  );
}