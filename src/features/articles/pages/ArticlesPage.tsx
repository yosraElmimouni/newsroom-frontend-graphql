import './article.css';
import { useMemo, useState } from 'react';


type ArticleStatus =
  | 'BROUILLON'
  | 'EN_ATTENTE_MEDIA'
  | 'EN_ATTENTE_VALIDATION'
  | 'MEDIAS_REFUSES'
  | 'CORRECTION_DEMANDEE'
  | 'PUBLIE'
  | 'ARCHIVE';

interface StaticArticle {
  id: number;
  title: string;
  author: string;
  status: ArticleStatus;
  date: string;
}

const STATIC_ARTICLES: StaticArticle[] = [
  { id: 1, title: 'Rentrée scolaire en Occitanie', author: 'Fatima B.', status: 'PUBLIE', date: '18 juil.' },
  { id: 2, title: 'Interview maire — projet tramway', author: 'Sara M.', status: 'EN_ATTENTE_VALIDATION', date: '20 juil.' },
  { id: 3, title: 'Dossier: festival d\'été régional', author: 'Youssef K.', status: 'BROUILLON', date: '23 juil.' },
  { id: 4, title: 'Reportage agriculture locale', author: 'Fatima B.', status: 'EN_ATTENTE_MEDIA', date: '25 juil.' },
  { id: 5, title: 'Manifestation étudiante à Toulouse', author: 'Sara M.', status: 'MEDIAS_REFUSES', date: '14 juil.' },
  { id: 6, title: 'Nouveau plan vélo métropolitain', author: 'Youssef K.', status: 'CORRECTION_DEMANDEE', date: '12 juil.' },
  { id: 7, title: 'Rétrospective municipales 2025', author: 'Fatima B.', status: 'ARCHIVE', date: '02 mai' },
  { id: 8, title: 'Ouverture du marché de Noël', author: 'Sara M.', status: 'PUBLIE', date: '10 juil.' },
];

const STATUS_LABEL: Record<ArticleStatus, string> = {
  BROUILLON: 'Brouillon',
  EN_ATTENTE_MEDIA: 'Attente média',
  EN_ATTENTE_VALIDATION: 'Attente validation',
  MEDIAS_REFUSES: 'Médias refusés',
  CORRECTION_DEMANDEE: 'Correction demandée',
  PUBLIE: 'Publié',
  ARCHIVE: 'Archivé',
};

const STATUS_BADGE_CLASS: Record<ArticleStatus, string> = {
  BROUILLON: 'status-brouillon',
  EN_ATTENTE_MEDIA: 'status-attente-media',
  EN_ATTENTE_VALIDATION: 'status-attente-validation',
  MEDIAS_REFUSES: 'status-medias-refuses',
  CORRECTION_DEMANDEE: 'status-correction',
  PUBLIE: 'status-publie',
  ARCHIVE: 'status-archive',
};

const STATUS_OPTIONS: ArticleStatus[] = [
  'BROUILLON',
  'EN_ATTENTE_MEDIA',
  'EN_ATTENTE_VALIDATION',
  'MEDIAS_REFUSES',
  'CORRECTION_DEMANDEE',
  'PUBLIE',
  'ARCHIVE',
];

export default function ArticlesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'ALL'>('ALL');

  const filteredArticles = useMemo(() => {
    return STATIC_ARTICLES.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.author.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || article.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="page">
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Articles</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {STATIC_ARTICLES.length} articles au total
        </p>
      </div>

      <div className="card">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Rechercher un titre ou un auteur..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ArticleStatus | 'ALL')}
          >
            <option value="ALL">Tous les statuts</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABEL[status]}
              </option>
            ))}
          </select>
          <span className="filter-count">
            {filteredArticles.length} résultat{filteredArticles.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="articles-table-wrapper" style={{ marginTop: '1rem' }}>
          {filteredArticles.length === 0 ? (
            <div className="empty-state">Aucun article ne correspond à votre recherche.</div>
          ) : (
            <table className="articles-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Auteur</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td className="article-title-cell">{article.title}</td>
                    <td className="article-author-cell">{article.author}</td>
                    <td>
                      <span className={`status-badge ${STATUS_BADGE_CLASS[article.status]}`}>
                        {STATUS_LABEL[article.status]}
                      </span>
                    </td>
                    <td className="article-date-cell">{article.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}