import "../style/article.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ArticleStatus } from "../types";
import { STATUS_LABEL, STATUS_OPTIONS, STATUS_BADGE_CLASS } from '../data/mockArticle';

import { useArticles } from "../data/articlesData";

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | "ALL">("ALL");
  const navigate = useNavigate();

  const { articles, loading, error } = useArticles();
  
  const filteredArticles = useMemo(() => {
    return articles.filter((article: { titre: string; auteur: { nom: string }; statut: string }) => {
      const matchesSearch =
        article.titre.toLowerCase().includes(search.toLowerCase()) ||
        article.auteur.nom.toLowerCase().includes(search.toLowerCase());
        
      const matchesStatus = statusFilter === "ALL" || article.statut === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [articles, search, statusFilter]);

  if (loading) return <div className="page">Chargement des articles...</div>;
  if (error) return <div className="page">Erreur lors du chargement des articles : {error.message}</div>;


  return (
    
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111827" }}>
            Articles
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            {articles.length} articles au total
          </p>
        </div>
        <Link to="/articles/nouveau" className="btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nouvel article
        </Link>
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
            onChange={(e) => setStatusFilter(e.target.value as ArticleStatus | "ALL")}
          >
            <option value="ALL">Tous les statuts</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABEL[status]}
              </option>
            ))}
          </select>
          <span className="filter-count">
            {filteredArticles.length} résultat{filteredArticles.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="articles-table-wrapper" style={{ marginTop: "1rem" }}>
          {filteredArticles.length === 0 ? (
            <div className="empty-state">Aucun article ne correspond à votre recherche.</div>
          ) : (
            <table className="articles-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Auteur</th>
                  <th>categorie</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="article-row"
                    onClick={() => navigate(`/article/${article.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="article-title-cell">{article.titre}</td>
                    <td className="article-author-cell">{article.auteur.nom } {article.auteur.prenom}</td>
                    <td>{article.categorie}</td>
                    <td>
                      <span className={`status-badge ${STATUS_BADGE_CLASS[article.statut]}`}>
                        {article.statut}
                      </span>
                    </td>
                    <td className="article-date-cell">
                      {new Date(article.dateCreation).toLocaleDateString('fr-FR')}
                    </td>
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


