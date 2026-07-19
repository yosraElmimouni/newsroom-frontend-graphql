
import './admin.css';

interface StaticSource {
  id: number;
  name: string;
  active: boolean;
}
interface EditorialEvent {
  id: number;
  title: string;
  date: string;
  author: string;
  status: 'planifié' | 'en_redaction' | 'pret';
}

const STATIC_EDITORIAL_EVENTS: EditorialEvent[] = [
  { id: 1, title: 'Rentrée scolaire en Occitanie', date: '18 juil.', author: 'Fatima B.', status: 'pret' },
  { id: 2, title: 'Interview maire — projet tramway', date: '20 juil.', author: 'Sara M.', status: 'en_redaction' },
  { id: 3, title: 'Dossier: festival d\'été régional', date: '23 juil.', author: 'Youssef K.', status: 'planifié' },
  { id: 4, title: 'Reportage agriculture locale', date: '25 juil.', author: 'Fatima B.', status: 'planifié' },
];

const statusLabel: Record<EditorialEvent['status'], string> = {
  planifié: 'Planifié',
  en_redaction: 'En rédaction',
  pret: 'Prêt à publier',
};

const statusBadgeClass: Record<EditorialEvent['status'], string> = {
  planifié: 'badge-planifie',
  en_redaction: 'badge-redaction',
  pret: 'badge-pret',
};

const STATIC_SOURCES: StaticSource[] = [
  { id: 1, name: 'France 3 Occitanie', active: true },
  { id: 2, name: 'AFP Régions', active: true },
  { id: 3, name: 'Correspondant local', active: false },
];

const KPI_CARDS = [
  { label: 'Utilisateurs actifs', value: 42 },
  { label: 'Articles publiés ce mois', value: 128 },
  { label: 'Sources actives', value: 17 },
  { label: 'Événements à venir', value: 9 },
];

const RECENT_ACTIVITY = [
  { text: 'Fatima a publié un article', tone: 'success' as const },
  { text: 'Article rejeté par la Cellule de validation', tone: 'danger' as const },
  { text: 'Nouvel utilisateur ajouté', tone: 'neutral' as const },
];

const dotClass: Record<'success' | 'danger' | 'neutral', string> = {
  success: 'dot-success',
  danger: 'dot-danger',
  neutral: 'dot-neutral',
};

export default function AdminPage() {
  return (
    <div className="page">
      {/* Cartes KPI */}
      <div className="kpi-grid">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className="kpi-cell">
            <p className="kpi-label">{kpi.label}</p>
            <p className="kpi-value">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Alerte articles bloqués */}
      <div className="alert-warning">
        3 articles en attente de validation depuis plus de 3 jours
      </div>

      <div className="row-main">
      
        <div className="card">
          <p className="card-title">Calendrier éditorial</p>
          <div className="calendar-list">
            {STATIC_EDITORIAL_EVENTS.map((event) => (
              <div key={event.id} className="calendar-item">
                <div className="calendar-date">{event.date}</div>
                <div className="calendar-content">
                  <p className="calendar-title">{event.title}</p>
                  <p className="calendar-author">{event.author}</p>
                </div>
                <span className={`calendar-badge ${statusBadgeClass[event.status]}`}>
                  {statusLabel[event.status]}
                </span>
              </div>
            ))}
          </div>
          <button className="btn-secondary">+ Planifier un article</button>
        </div>

      
        <div className="card">
          <p className="card-title">Répartition des rôles</p>
          <div className="donut-wrapper">
            <div
              className="donut-circle"
              style={{
                background:
                  'conic-gradient(#0F6E56 0% 40%, #639922 40% 65%, #854F0B 65% 85%, #A32D2D 85% 100%)',
              }}
            />
            <div className="donut-legend">
              <span><span className="legend-dot dot-teal" />Journalistes 40%</span>
              <span><span className="legend-dot dot-green" />Validation 25%</span>
              <span><span className="legend-dot dot-amber" />Média 20%</span>
              <span><span className="legend-dot dot-red" />Admin 15%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row-secondary">
      
        <div className="card">
          <p className="card-title">Sources</p>
          <table className="table">
            <tbody>
              {STATIC_SOURCES.map((source) => (
                <tr key={source.id} className="table-row">
                  <td style={{ padding: '0.5rem 0' }}>{source.name}</td>
                  <td
                    style={{ padding: '0.5rem 0', textAlign: 'right' }}
                    className={source.active ? 'status-active' : 'status-inactive'}
                  >
                    {source.active ? 'Active' : 'Désactivée'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-secondary">+ Ajouter une source</button>
        </div>

        <div className="card">
          <p className="card-title">Activité récente</p>
          <div className="activity-list">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="activity-item">
                <span className={`activity-dot ${dotClass[item.tone]}`} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}