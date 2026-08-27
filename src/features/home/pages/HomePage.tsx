import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/home.css';
import { STATIC_ARTICLES } from '../../articles/data/mockArticle';
import { STATIC_VEILLE, THEME_OPTIONS, type Theme } from '../../veille-info/data/mockVeille';

const EDITION_DATE = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export default function HomePage() {
  const navigate = useNavigate();
  const [veilleTheme, setVeilleTheme] = useState<Theme | 'TOUS'>('TOUS');

  const publishedArticles = useMemo(
    () =>
      STATIC_ARTICLES.filter((a) => a.statut === 'Publié').sort((a, b) => {
        const da = a.datePublication ?? a.dateCreation;
        const db = b.datePublication ?? b.dateCreation;
        return db.getTime() - da.getTime();
      }),
    [],
  );

  const filteredVeille = useMemo(
    () => (veilleTheme === 'TOUS' ? STATIC_VEILLE : STATIC_VEILLE.filter((v) => v.theme === veilleTheme)),
    [veilleTheme],
  );

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-logo">
            <span className="home-logo-title">Newsroom</span>
            <span className="home-logo-date">Édition du {EDITION_DATE}</span>
          </div>

          <nav className="home-nav">
            <a href="#articles">Articles</a>
            <a href="#veille">Veille info</a>
          </nav>

          <button type="button" onClick={() => navigate('/login')} className="home-btn home-btn-primary">
            Se connecter
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <p className="home-hero-eyebrow">Salle de rédaction numérique</p>
          <h1 className="home-hero-title">
            L&apos;actualité vérifiée, mise en forme et publiée au même endroit.
          </h1>
          <p className="home-hero-desc">
            Retrouvez les derniers articles publiés par notre rédaction ainsi que la veille d&apos;actualité
            remontée en continu depuis plusieurs sources d&apos;information.
          </p>
          <div className="home-hero-actions">
            <a href="#articles" className="home-btn home-btn-light">
              Voir les articles
            </a>
            <button type="button" onClick={() => navigate('/login')} className="home-btn home-btn-outline">
              Accès rédaction →
            </button>
          </div>
        </div>
      </section>

      {/* Articles publiés */}
      <section id="articles" className="home-section">
        <div className="home-section-header">
          <div>
            <p className="home-eyebrow">Notre rédaction</p>
            <h2 className="home-section-title">Articles publiés</h2>
          </div>
          <span className="home-section-count">{publishedArticles.length} articles</span>
        </div>

        {publishedArticles.length === 0 ? (
          <p className="home-empty">Aucun article publié pour le moment.</p>
        ) : (
          <div className="home-grid">
            {publishedArticles.map((article) => {
              const imageUrl = article.medias?.[0]?.urlFichier;
              return (
                <article key={article.id} className="home-card">
                  <div className="home-card-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt="" />
                    ) : (
                      <div className="home-card-image-placeholder">N</div>
                    )}
                    <span className="home-card-tag">{article.categorie}</span>
                  </div>
                  <div className="home-card-body">
                    <div className="home-card-meta">
                      <strong>
                        {article.auteur.prenom} {article.auteur.nom}
                      </strong>
                      <span className="home-card-meta-date">
                        {formatDate(article.datePublication ?? article.dateCreation)}
                      </span>
                    </div>
                    <h3 className="home-card-title">{article.title}</h3>
                    <p className="home-card-excerpt">{article.contenu}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Veille info */}
      <section id="veille" className="home-section--alt">
        <div className="home-section">
          <div className="home-section-header">
            <div>
              <p className="home-eyebrow">Sources externes suivies</p>
              <h2 className="home-section-title">Veille info</h2>
            </div>

            <div className="home-filters">
              <button
                type="button"
                onClick={() => setVeilleTheme('TOUS')}
                className={`home-filter-chip ${veilleTheme === 'TOUS' ? 'is-active' : ''}`}
              >
                Tous
              </button>
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setVeilleTheme(theme)}
                  className={`home-filter-chip ${veilleTheme === theme ? 'is-active' : ''}`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {filteredVeille.length === 0 ? (
            <p className="home-empty">Aucune actualité pour ce thème.</p>
          ) : (
            <div className="home-grid">
              {filteredVeille.map((item) => (
                <a key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer" className="home-card">
                  <div className="home-card-image">
                    <img src={item.image} alt="" />
                    <span className="home-card-tag">{item.theme}</span>
                  </div>
                  <div className="home-card-body">
                    <div className="home-card-meta">
                      <strong>{item.source}</strong>
                      {item.sourceReliable && <span className="home-card-meta-badge">vérifiée</span>}
                      <span className="home-card-meta-date">{item.time}</span>
                    </div>
                    <h3 className="home-card-title">{item.title}</h3>
                    <p className="home-card-excerpt">{item.excerpt}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-inner">
          <span className="home-footer-brand">Newsroom</span>
          <span className="home-footer-copy">© {new Date().getFullYear()} Newsroom — Tous droits réservés</span>
          <button type="button" onClick={() => navigate('/login')} className="home-footer-link">
            Accès rédaction →
          </button>
        </div>
      </footer>
    </div>
  );
}
