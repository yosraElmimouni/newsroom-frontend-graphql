import { Link, useNavigate, useParams } from "react-router-dom";
import "../style/article.css";

import { getArticleItemById, STATUS_BADGE_CLASS } from "../data/mockArticle";
import { useArticleById } from "../data/articlesData";

function formatDate(date?: Date) {
  if (!date) return "-";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
} 

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export default function DetailArticlePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { article, loading, error } = useArticleById(Number(id));
  const handleModifierArticle = () => {
    if (id) {
      navigate(`/articles/modifier/${id}`);
    }
  };
  if (loading) return <div className="page">Chargement des articles...</div>;
  if (error)
    return (
      <div className="page">
        Erreur lors du chargement des articles : {error.message}
      </div>
    );

  if (!article) {
    return (
      <div className="page">
        <Link to="/articles" className="back-link">
          <BackIcon />
          Retour aux articles
        </Link>
        <div className="card empty-state">Cet article est introuvable.</div>
      </div>
    );
  }

  // Un article encore au statut "Brouillon" n'a pas de mise en forme éditoriale
  // à afficher : on montre un simple formulaire de relecture des champs saisis.
  if (article.statut === "Brouillon") {
    return (
      <div className="page">
        <div className="page-header">
          <div className="page-header-info">
            <Link to="/articles" className="page-header-back-link">
              <BackIcon />
              <div>Retour aux articles</div>
            </Link>

            <h1 className="text-xl font-semibold text-gray-900">
              Détail de l'article
            </h1>

            <p className="text-sm text-gray-500">
              Voir les informations de l'article.
            </p>
          </div>

          <button
            type="button"
            onClick={handleModifierArticle}
            className="btn-primary"
          >
            Modifier l'article
          </button>
        </div>

        <form className="article-form-layout">
          <div className="article-form-main">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="mb-1 block text-sm text-gray-700"
              >
                Titre
              </label>
              <div id="title" className="form-input">
                {article?.titre || "-"}
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="mb-1 block text-sm text-gray-700"
              >
                Contenu
              </label>
              <div id="content" className="form-input">
                {article?.contenu || "-"}
              </div>
            </div>
          </div>

          <aside className="article-form-sidebar">
            <div className="form-sidebar-card">
              <h2 className="sidebar-card-title">Classement</h2>

              <div className="mb-3">
                <label
                  htmlFor="category"
                  className="mb-1 block text-xs text-gray-500"
                >
                  Catégorie
                </label>
                <div id="category" className="form-input">
                  {article?.categorie || "-"}
                </div>
              </div>
            </div>

            <div className="form-sidebar-card">
              <h2 className="sidebar-card-title">Tags</h2>

              {article?.tags && article.tags.length > 0 && (
                <div className="mt-3 tag-pill-list">
                  {article.tags.map((tag) => (
                    <span key={tag} className="tag-pill-editable">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </form>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="article-detail-topbar">
        <Link to="/articles" className="back-link">
          ← Retour aux articles
        </Link>
      </div>

      <div className="article-detail-layout">
        {/* Contenu principal */}
        <div className="card article-detail-main">
          <div className="article-detail-header">
            <div className="article-detail-badges">
              <span
                className={`status-badge ${STATUS_BADGE_CLASS[article.statut]}`}
              >
                {article.statut}
              </span>
              <span className="category-pill">{article.categorie}</span>
            </div>

            <h1 className="article-detail-title">{article.titre}</h1>

            <div className="article-detail-meta-row">
              <span className="author-avatar">{initials(article.auteur.nom)}</span>
              <div className="article-detail-meta-text">
                <span className="article-detail-author-name">
                  {article.auteur.prenom} {article.auteur.nom}
                </span>
                <span className="article-detail-date">
                  Créé le {article.dateCreation}
                  {article.dateModification && (
                    <>
                      <span className="article-detail-dot"> · </span>
                      Modifié le {article.dateModification}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="article-detail-body">
            {article.contenu || "Aucun contenu."}
          </div>
        </div>

        {/* Métadonnées */}
        <div className="article-detail-sidebar">
          <div className="card">
            <div className="sidebar-card-title">Informations</div>

            <div className="sidebar-info-row">
              <span className="sidebar-info-label">Statut</span>
              <span className="sidebar-info-value">{article.statut}</span>
            </div>
            <div className="sidebar-info-row">
              <span className="sidebar-info-label">Catégorie</span>
              <span className="sidebar-info-value">{article.categorie}</span>
            </div>
            <div className="sidebar-info-row">
              <span className="sidebar-info-label">Publication prévue</span>
              <span className="sidebar-info-value">
                {article.datePublication}
              </span>
            </div>
          </div>

          <div className="card">
            <div className="sidebar-card-title">Tags</div>
            {article.tags?.length ? (
              <div className="tag-pill-list">
                {article.tags.map((tag, index) => (
                  <span key={index} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className="sidebar-empty">Aucun tag</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
