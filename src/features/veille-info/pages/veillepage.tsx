import '../style/veille.css';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  STATIC_VEILLE,
  THEME_BADGE_CLASS,
  THEME_OPTIONS,
  type Theme,
} from '../data/mockVeille';

type ViewFilter = 'ALL' | 'UNREAD' | 'FAVORITES';

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.5" fill="none">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.5z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.5" fill="none">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.3 2.3 4.7-5" />
    </svg>
  );
}

export default function veillepage() {
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState<Theme | 'ALL'>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [viewFilter, setViewFilter] = useState<ViewFilter>('ALL');
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const sources = useMemo(
    () => Array.from(new Set(STATIC_VEILLE.map((item) => item.source))).sort(),
    []
  );

  const filteredItems = useMemo(() => {
    return STATIC_VEILLE.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesTheme = themeFilter === 'ALL' || item.theme === themeFilter;
      const matchesSource = sourceFilter === 'ALL' || item.source === sourceFilter;
      const matchesView =
        viewFilter === 'ALL' ||
        (viewFilter === 'UNREAD' && !readIds.has(item.id)) ||
        (viewFilter === 'FAVORITES' && favoriteIds.has(item.id));
      return matchesSearch && matchesTheme && matchesSource && matchesView;
    });
  }, [search, themeFilter, sourceFilter, viewFilter, readIds, favoriteIds]);

  const unreadCount = STATIC_VEILLE.length - readIds.size;

  function toggleRead(id: number) {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleFavorite(id: number) {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="page">
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Veille info</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {STATIC_VEILLE.length} sujets suivis · {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
        </p>
      </div>

      <div className="card">
        <div className="filters-bar">
          <div className="view-toggle">
            <button
              type="button"
              className={`view-chip ${viewFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setViewFilter('ALL')}
            >
              Tous <span className="view-chip-count">{STATIC_VEILLE.length}</span>
            </button>
            <button
              type="button"
              className={`view-chip ${viewFilter === 'UNREAD' ? 'active' : ''}`}
              onClick={() => setViewFilter('UNREAD')}
            >
              Non lus <span className="view-chip-count">{unreadCount}</span>
            </button>
            <button
              type="button"
              className={`view-chip ${viewFilter === 'FAVORITES' ? 'active' : ''}`}
              onClick={() => setViewFilter('FAVORITES')}
            >
              Favoris <span className="view-chip-count">{favoriteIds.size}</span>
            </button>
          </div>

          <input
            type="text"
            placeholder="Rechercher un sujet, un mot-clé..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value as Theme | 'ALL')}
          >
            <option value="ALL">Tous les thèmes</option>
            {THEME_OPTIONS.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="ALL">Toutes les sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>

          <span className="filter-count">
            {filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ marginTop: '1rem' }}>
          {filteredItems.length === 0 ? (
            <div className="empty-state">Aucun sujet ne correspond à votre recherche.</div>
          ) : (
            <div className="veille-grid">
              {filteredItems.map((item) => {
                const isRead = readIds.has(item.id);
                const isFavorite = favoriteIds.has(item.id);
                return (
                  <article key={item.id} className={`veille-card ${isRead ? 'is-read' : ''}`}>
                    <Link
                      to={`/veille-info/${item.id}`}
                      className="veille-card-link"
                      onClick={() => toggleRead(item.id)}
                    >
                      <div className="veille-card-image-wrapper">
                        <img src={item.image} alt="" className="veille-card-image" loading="lazy" />
                        {isRead && <span className="read-flag">Lu</span>}
                      </div>
                      <div className="veille-card-body">
                        <div className="veille-card-meta">
                          <span className="veille-source">{item.source}</span>
                          <span>·</span>
                          <span>{item.time}</span>
                        </div>
                        <h3 className="veille-card-title">{item.title}</h3>
                        <p className="veille-card-excerpt">{item.excerpt}</p>
                      </div>
                    </Link>
                    <div className="veille-card-footer">
                      <span className={`theme-badge ${THEME_BADGE_CLASS[item.theme]}`}>
                        {item.theme}
                      </span>
                      <div className="veille-card-actions">
                        <button
                          type="button"
                          className={`action-btn ${isFavorite ? 'is-favorite' : ''}`}
                          onClick={() => toggleFavorite(item.id)}
                          aria-pressed={isFavorite}
                          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          <StarIcon />
                        </button>
                        <button
                          type="button"
                          className={`action-btn ${isRead ? 'is-read-btn' : ''}`}
                          onClick={() => toggleRead(item.id)}
                          aria-pressed={isRead}
                          title={isRead ? 'Marquer comme non lu' : 'Marquer comme lu'}
                        >
                          <CheckIcon />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
