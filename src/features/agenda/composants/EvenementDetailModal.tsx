import type { agenda } from "../types";
import "../style/evenementDetailModal.css";
import { useDeleteEvent, useUpdateEvent } from "../data/agendaData";
import { useState } from "react";
import NouvelEvenementModal from "./NouvelEvenementModal";

interface EvenementDetailModalProps {
  evenement: agenda;
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

function formatDate(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EvenementDetailModal({
  evenement,
  onClose,
}: EvenementDetailModalProps) {
  const debut = new Date(evenement.dateDebut);
  const fin = new Date(evenement.dateFin);
  const plusieursJours =
    debut.getFullYear() !== fin.getFullYear() ||
    debut.getMonth() !== fin.getMonth() ||
    debut.getDate() !== fin.getDate();

  const [deleteEvent, { loading: deleting }] = useDeleteEvent();
  const [modifierEvent, { loading: modifing }] = useUpdateEvent();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    setDeleteError(null);
    try {
      await deleteEvent({ variables: { id: evenement.id } });
      onClose(); // Fermer le modal après la suppression
    } catch (err) {
      setDeleteError("La suppression a échoué. Veuillez réessayer.");
      console.error(err);
    }
  };

  const handleUpdate = async (
    payload: Omit<agenda, "id" | "source"> & { sourceId: number },
  ) => {
    setUpdateError(null);
    try {
      await modifierEvent({
        variables: {
          updateAgendaInput: {
            id: evenement.id,
            title: payload.title,
            resume: payload.resume,
            categorie: payload.categorie,
            importance: payload.importance,
            dateDebut: payload.dateDebut,
            dateFin: payload.dateFin,
            lieu: payload.lieu,
            sourceId: payload.sourceId,
          },
        },
      });
      setIsEditOpen(false);
      onClose(); // la liste se rafraîchit via refetchQueries dans useUpdateEvent
    } catch (err) {
      setUpdateError("La modification a échoué. Veuillez réessayer.");
      console.error(err);
    }
  };

  return (
    <div className="evenement-modal-backdrop" onClick={onClose}>
      <div
        className="evenement-detail-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="evenement-modal-header">
          <div>
            <p className="evenement-modal-eyebrow">Détail de l'événement</p>
            <h2 className="evenement-modal-title">{evenement.title}</h2>
          </div>
          <button
            type="button"
            className="evenement-modal-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="evenement-detail-body">
          <div className="evenement-detail-badges">
            <span
              className={`calendar-event-pill ${IMPORTANCE_BADGE_CLASS[evenement.importance] ?? ""}`}
            >
              {evenement.importance}
            </span>
            <span className="evenement-detail-categorie">
              {evenement.categorie}
            </span>
          </div>
          <div className="evenement-detail-row">
            <span className="evenement-detail-label">Dates</span>
            <span className="evenement-detail-value">
              {plusieursJours
                ? `${formatDate(debut)} → ${formatDate(fin)}`
                : formatDate(debut)}
            </span>
          </div>
          <div className="evenement-detail-row">
            <span className="evenement-detail-label">Lieu</span>
            <span className="evenement-detail-value">{evenement.lieu}</span>
          </div>
          {evenement.resume && (
            <div className="evenement-detail-row evenement-detail-row-block">
              <span className="evenement-detail-label">Résumé</span>
              <p className="evenement-detail-value">{evenement.resume}</p>
            </div>
          )}
          {evenement.source && (
            <div className="evenement-detail-row">
              {" "}
              <span className="evenement-detail-label">Source</span>{" "}
              <span className="evenement-detail-value">
                {" "}
                {evenement.source.url ? (
                  <a
                    href={evenement.source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    {evenement.source.nom}{" "}
                  </a>
                ) : (
                  evenement.source.nom
                )}{" "}
              </span>{" "}
            </div>
          )}{" "}
        </div>

        {(deleteError || updateError) && (
          <p className="evenement-detail-error">{deleteError ?? updateError}</p>
        )}

        <div className="evenement-liste-footer">
        <button
          type="button"
          className="evenement-liste-footer-btn"
          onClick={onClose}
          disabled={deleting || modifing}
        >
          Fermer
        </button>

        <button
          type="button"
          className="evenement-liste-footer-btn"
          disabled={deleting || modifing}
          onClick={() => setIsEditOpen(true)}
        >
          {modifing ? "Modification..." : "Modifier"}
        </button>

        <button
          type="button"
          className="evenement-liste-footer-btn evenement-liste-footer-btn--delete"
          disabled={deleting || modifing}
          onClick={() => {
            if (
              window.confirm(
                "Êtes-vous sûr de vouloir supprimer cet événement ?",
              )
            ) {
              handleDelete();
            }
          }}
        >
          {deleting ? "Suppression..." : "Supprimer"}
        </button>
      </div>
      </div>

      

      {isEditOpen && (
        <NouvelEvenementModal
          dateInitiale={debut}
          evenement={evenement}
          onClose={() => setIsEditOpen(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
