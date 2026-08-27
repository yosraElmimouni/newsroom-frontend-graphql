import '../style/veille.css';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { THEME_BADGE_CLASS, getVeilleItemById } from '../data/mockVeille';

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

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

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M10 14 21 3" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function VeilleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const item = id ? getVeilleItemById(Number(id)) : undefined;

  const [isRead, setIsRead] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!item) {
    return (
      <div className="page">
        <div className="card veille-not-found">
          <p>Cette actualité de veille est introuvable ou a été retirée.</p>
          <Link to="/veille-info" className="btn-secondary" style={{ display: 'inline-block', marginTop: '0.75rem' }}>
            Retour à la veille info
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <button type="button" className="veille-detail-back" onClick={() => navigate('/veille-info')}>
        <ArrowLeftIcon />
        Retour à la veille info
      </button>

      <div className="veille-detail-layout">
        <div className="card">
          <div className="veille-detail-image-wrapper">
            <img src={item.image} alt="" className="veille-detail-image" />
          </div>

          <div className="veille-detail-meta">
            <span className="veille-detail-source">{item.source}</span>
            <span
              className={`reliability-badge ${item.sourceReliable ? 'is-reliable' : 'is-unverified'}`}
            >
              {item.sourceReliable ? 'Source fiable' : 'À vérifier'}
            </span>
            <span>·</span>
            <span>{item.time}</span>
            <span className={`theme-badge ${THEME_BADGE_CLASS[item.theme]}`}>{item.theme}</span>
          </div>

          <h1 className="veille-detail-title">{item.title}</h1>
          <p className="veille-detail-excerpt">{item.excerpt}</p>

          <div className="veille-detail-content">
            {item.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {item.tags.length > 0 && (
            <div className="veille-detail-tags">
              {item.tags.map((tag) => (
                <span key={tag} className="veille-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <aside className="veille-detail-sidebar">
          <div className="card">
            <h2 className="card-title">Actions</h2>
            <div className="veille-detail-actions">
              <button
                type="button"
                className={`btn-outline ${isFavorite ? 'is-active' : ''}`}
                onClick={() => setIsFavorite((prev) => !prev)}
                aria-pressed={isFavorite}
              >
                <StarIcon />
                {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </button>
              <button
                type="button"
                className={`btn-outline ${isRead ? 'is-active' : ''}`}
                onClick={() => setIsRead((prev) => !prev)}
                aria-pressed={isRead}
              >
                <CheckIcon />
                {isRead ? 'Marquer comme non lu' : 'Marquer comme lu'}
              </button>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <ExternalLinkIcon />
                Voir la source originale
              </a>
              <Link to="/articles/nouveau" className="btn-primary" style={{ justifyContent: 'center' }}>
                <PlusIcon />
                Créer un article
              </Link>
            </div>
          </div>

          <div className="card veille-detail-source-card">
            <h2 className="card-title">Source</h2>
            <dl>
              <div className="source-row">
                <dt>Nom</dt>
                <dd>{item.source}</dd>
              </div>
              <div className="source-row">
                <dt>Fiabilité</dt>
                <dd>{item.sourceReliable ? 'Vérifiée' : 'Non vérifiée'}</dd>
              </div>
              <div className="source-row">
                <dt>Thème</dt>
                <dd>{item.theme}</dd>
              </div>
              <div className="source-row">
                <dt>Publié</dt>
                <dd>{item.time}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
