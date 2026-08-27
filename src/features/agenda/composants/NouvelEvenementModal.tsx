import { useEffect, useState, type FormEvent } from 'react';
import type { agenda } from '../types';
import { useSources } from '../data/agendaData';
import VilleAutocomplete from '../composants/Villeautocomplete';
import '../style/evenementModal.css';

interface NouvelEvenementModalProps {
  dateInitiale: Date;
  evenement?: agenda | null; // si fourni => mode édition (pré-remplit le formulaire)
  onClose: () => void;
  onSave: (evenement: Omit<agenda, 'id' | 'source'> & { sourceId: number }) => void;
}

const CATEGORIE_OPTIONS = ['Actualité', 'Politique', 'Culture', 'Société', 'Sport', 'Économie', 'Autre'];
const IMPORTANCE_OPTIONS: string[] = ['Faible', 'Moyenne', 'Forte'];

function toInputDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fromInputDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function NouvelEvenementModal({
  dateInitiale,
  evenement,
  onClose,
  onSave,
}: NouvelEvenementModalProps) {
  const { sources, loading: sourcesLoading, error: sourcesError } = useSources();
  const isEditing = !!evenement;

  const [title, setTitle] = useState(evenement?.title ?? '');
  const [categorie, setCategorie] = useState(evenement?.categorie ?? CATEGORIE_OPTIONS[0]);
  const [importance, setImportance] = useState(evenement?.importance ?? IMPORTANCE_OPTIONS[1]);
  const [dateDebut, setDateDebut] = useState(
    toInputDate(evenement ? new Date(evenement.dateDebut) : dateInitiale),
  );
  const [dateFin, setDateFin] = useState(
    toInputDate(evenement ? new Date(evenement.dateFin) : dateInitiale),
  );
  const [lieu, setLieu] = useState(evenement?.lieu ?? '');
  const [resume, setResume] = useState(evenement?.resume ?? '');
  const [sourceId, setSourceId] = useState<number | ''>(evenement?.source?.id ?? '');
  const [error, setError] = useState('');

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleDateDebutChange(value: string) {
    setDateDebut(value);
    // La date de fin suit la date de début tant qu'elle n'a pas été modifiée manuellement pour être antérieure.
    if (dateFin < value) setDateFin(value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      setError('Le titre est obligatoire.');
      return;
    }
    if (!lieu.trim()) {
      setError('Le lieu est obligatoire.');
      return;
    }
    if (dateFin < dateDebut) {
      setError('La date de fin ne peut pas précéder la date de début.');
      return;
    }
    if (!sourceId) {
      setError('La source est obligatoire.');
      return;
    }

    onSave({
      title: title.trim(),
      resume: resume.trim(),
      categorie,
      importance,
      dateDebut: fromInputDate(dateDebut),
      dateFin: fromInputDate(dateFin),
      lieu: lieu.trim(),
      sourceId,
    });
  }

  return (
    <div className="evenement-modal-backdrop" onClick={onClose}>
      <div className="evenement-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="evenement-modal-header">
          <h2 className="evenement-modal-title">
            {isEditing ? "Modifier l'événement" : 'Nouvel événement'}
          </h2>
          <button type="button" className="evenement-modal-close" onClick={onClose} aria-label="Fermer">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="evenement-modal-form">
          <div className="evenement-form-group">
            <label htmlFor="evt-title">Titre</label>
            <input
              id="evt-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Interview maire — tramway"
            />
          </div>

          <div className="evenement-form-row">
            <div className="evenement-form-group">
              <label htmlFor="evt-date-debut">Date de début</label>
              <input
                id="evt-date-debut"
                type="date"
                value={dateDebut}
                onChange={(e) => handleDateDebutChange(e.target.value)}
              />
            </div>
            <div className="evenement-form-group">
              <label htmlFor="evt-date-fin">Date de fin</label>
              <input
                id="evt-date-fin"
                type="date"
                value={dateFin}
                min={dateDebut}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>

          <div className="evenement-form-row">
            <div className="evenement-form-group">
              <label htmlFor="evt-categorie">Catégorie</label>
              <select id="evt-categorie" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                {CATEGORIE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="evenement-form-group">
              <label htmlFor="evt-importance">Importance</label>
              <select
                id="evt-importance"
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
              >
                {IMPORTANCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="evenement-form-group">
            <label htmlFor="evt-source">Source</label>
            {sourcesError ? (
              <p className="evenement-form-error">Impossible de charger les sources.</p>
            ) : (
              <select
                id="evt-source"
                value={sourceId}
                disabled={sourcesLoading}
                onChange={(e) => setSourceId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">
                  {sourcesLoading ? 'Chargement des sources…' : 'Sélectionnez une source'}
                </option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="evenement-form-group">
            <label htmlFor="evt-lieu">Lieu</label>
            <VilleAutocomplete value={lieu} onChange={setLieu} placeholder="Ex. Casablanca" />
          </div>

          <div className="evenement-form-group">
            <label htmlFor="evt-resume">Résumé</label>
            <textarea
              id="evt-resume"
              rows={3}
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Contexte, éléments à retenir..."
            />
          </div>

          {error && <p className="evenement-form-error">{error}</p>}

          <div className="evenement-modal-actions">
            <button type="button" className="evenement-btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="evenement-btn-primary">
              {isEditing ? 'Enregistrer les modifications' : "Ajouter l'événement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}