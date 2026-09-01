import { useMemo } from "react";
import { Link } from "react-router-dom";
import "../style/admin.css";
import { useUsers } from "../data/usersData";

import { getUserInitials } from "../data/mockUser";
import {
  STATUS_LABEL,
  STATUS_BADGE_CLASS,
} from "../../articles/data/mockArticle";
import type { CategorieArticle } from "../../articles/types";
import { useAuth } from "../../../core/auth/useAuth";
import {
  AreaTrendChart,
  BarBreakdownChart,
} from "../composants/DashboardCharts";
import { useArticles } from "../../articles/data/articlesData";

const CATEGORY_META: Record<
  CategorieArticle,
  { label: string; color: string }
> = {
  POLITIQUE: { label: "Politique", color: "#2563eb" },
  ECONOMIE: { label: "Économie", color: "#0f766e" },
  TECHNOLOGIE: { label: "Technologie", color: "#7c3aed" },
  SPORT: { label: "Sport", color: "#ea580c" },
  CULTURE: { label: "Culture", color: "#be185d" },
  SANTE: { label: "Santé", color: "#dc2626" },
  EDUCATION: { label: "Éducation", color: "#0891b2" },
  ENVIRONNEMENT: { label: "Environnement", color: "#15803d" },
  INTERNATIONAL: { label: "International", color: "#4338ca" },
  SOCIETE: { label: "Société", color: "#b45309" },
  SCIENCE: { label: "Science", color: "#0d9488" },
  SECURITE: { label: "Sécurité", color: "#b91c1c" },
  DIVERTISSEMENT: { label: "Divertissement", color: "#c026d3" },
  AUTRE: { label: "Autre", color: "#64748b" },
};

const ROLE_BADGE_CLASS: Record<string, string> = {
  ADMIN: "role-admin",
  JOURNALISTE: "role-journaliste",
  EQUIPE_MEDIA: "role-equipe-media",
  CELLULE_VALIDATION: "role-cellule-validation",
};

function UsersIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ArticleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 3h12l4 4v14H4z" />
      <path d="M16 3v4h4" />
      <path d="M8 12h8M8 16h8M8 8h4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

const dayFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
});
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Construit les 7 derniers jours (aujourd'hui inclus), du plus ancien au plus récent. */
function lastSevenDays(): Date[] {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
  } = useArticles();

  const loading = usersLoading || articlesLoading;
  const error = usersError ?? articlesError;

  const stats = useMemo(() => {
    const days = lastSevenDays();

    const usersPerDay = days.map(
      (day) =>
        users.filter((u) => isSameDay(new Date(u.dateCreation), day)).length,
    );
    const articlesPerDay = days.map(
      (day) =>
        articles.filter((a) => isSameDay(new Date(a.dateCreation), day)).length,
    );

    const usersBefore = users.filter(
      (u) => new Date(u.dateCreation) < days[0],
    ).length;
    const articlesBefore = articles.filter(
      (a) => new Date(a.dateCreation) < days[0],
    ).length;

    const usersCumulative = usersPerDay.reduce<number[]>((acc, count, i) => {
      acc.push((i === 0 ? usersBefore : acc[i - 1]) + count);
      return acc;
    }, []);
    const articlesCumulative = articlesPerDay.reduce<number[]>(
      (acc, count, i) => {
        acc.push((i === 0 ? articlesBefore : acc[i - 1]) + count);
        return acc;
      },
      [],
    );

    const activeUsers = users.filter((u) => u.statut === "ACTIF").length;
    const pendingArticles = articles.filter(
      (a) => a.statut === "En attente" || a.statut === "EnCoursDeValidation",
    ).length;
    const publishedArticles = articles.filter(
      (a) => a.statut === "Publié",
    ).length;

    const categoryCounts = new Map<CategorieArticle, number>();
    articles.forEach((a) => {
      categoryCounts.set(
        a.categorie,
        (categoryCounts.get(a.categorie) ?? 0) + 1,
      );
    });
    const topCategories = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([categorie, value]) => ({
        label: CATEGORY_META[categorie]?.label ?? categorie,
        value,
        color: CATEGORY_META[categorie]?.color,
      }));

    const activityByDay = days.map((day, i) => ({
      label: dayFormatter.format(day),
      value: articlesPerDay[i],
    }));

    const recentUsers = [...users]
      .sort(
        (a, b) =>
          new Date(b.dateCreation).getTime() -
          new Date(a.dateCreation).getTime(),
      )
      .slice(0, 5);

    const articlesEnCour = articles.filter(
      (a) => a.statut === "En attente" || a.statut === "EnCoursDeValidation",
    );
    // const recentArticles = [...articlesEnCour]
    //   .sort(
    //     (a, b) =>
    //       new Date(b.dateCreation).getTime() -
    //       new Date(a.dateCreation).getTime(),
    //   )
    //   .slice(0, 5);

    const featuredArticles = articlesEnCour.slice(0, 4);

    return {
      totalUsers: users.length,
      totalArticles: articles.length,
      activeUsers,
      pendingArticles,
      publishedArticles,
      usersSparkline: usersCumulative.map((value) => ({ value })),
      articlesSparkline: articlesCumulative.map((value) => ({ value })),
      topCategories,
      activityByDay,
      recentUsers,
      featuredArticles,
    };
  }, [users, articles]);

  if (loading)
    return <div className="page">Chargement du tableau de bord...</div>;
  if (error)
    return (
      <div className="page">
        Erreur lors du chargement du tableau de bord : {error.message}
      </div>
    );

  return (
    <div className="page dashboard-page">
      {/* <div>
        <h1 className="page-title">Bonjour, </h1>
        <p className="page-subtitle">
          Suivez l'activité de la rédaction, les publications et les comptes en
          temps réel.
        </p>
      </div> */}

      {/* Cartes KPI */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-card--green">
          <span className="kpi-icon">
            <UsersIcon />
          </span>
          <div className="kpi-text">
            <p className="kpi-label">Utilisateurs</p>
            <p className="kpi-value">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="kpi-card kpi-card--blue">
          <span className="kpi-icon">
            <ArticleIcon />
          </span>
          <div className="kpi-text">
            <p className="kpi-label">Articles</p>
            <p className="kpi-value">{stats.totalArticles}</p>
          </div>
        </div>

        <div className="kpi-card kpi-card--purple">
          <span className="kpi-icon">
            <ClockIcon />
          </span>
          <div className="kpi-text">
            <p className="kpi-label">En attente</p>
            <p className="kpi-value">{stats.pendingArticles}</p>
          </div>
        </div>

        <div className="kpi-card kpi-card--red">
          <span className="kpi-icon">
            <CheckIcon />
          </span>
          <div className="kpi-text">
            <p className="kpi-label">Articles Publiés</p>
            <p className="kpi-value">{stats.publishedArticles}</p>
          </div>
        </div>
      </div>

      {/* Derniers articles créés */}
      <div>
        <div className="section-header-row">
          <p className="section-title">Articles En Cours</p>
          <Link to="/articles" className="section-link">
            Voir tous les articles →
          </Link>
        </div>
        <div className="article-card-grid">
          {stats.featuredArticles.map((article) => {
            const meta = CATEGORY_META[article.categorie];
            const initials =
              `${article.auteur.prenom?.[0] ?? ""}${article.auteur.nom?.[0] ?? ""}`.toUpperCase();
            return (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="article-card"
              >
                <div className="article-card-top">
                  <span
                    className={`status-badge ${STATUS_BADGE_CLASS[article.statut]}`}
                  >
                    {STATUS_LABEL[article.statut]}
                  </span>
                </div>

                <div className="article-card-body">
                  <p className="article-card-title">{article.titre}</p>

                  <div className="article-card-author-row">
                    <span className="avatar-chip avatar-chip-sm">
                      {initials}
                    </span>

                    <span className="article-card-author">
                      {article.auteur.prenom} {article.auteur.nom}
                    </span>
                  </div>

                  <span
                    className="article-card-category"
                    style={{
                      color: meta?.color,
                      background: `${meta?.color}12`,
                    }}
                  >
                    <span
                      className="article-card-category-dot"
                      style={{ background: meta?.color }}
                    />

                    {meta?.label ?? article.categorie}
                  </span>
                </div>
              </Link>
            );
          })}
          {stats.featuredArticles.length === 0 && (
            <p className="empty-state">Aucun article pour le moment.</p>
          )}
        </div>
      </div>

      {/* Graphiques */}
      <div className="chart-row">
        <div className="card chart-card">
          <p className="card-title">Publications (7 derniers jours)</p>
          <AreaTrendChart
            data={stats.activityByDay}
            color="var(--brand-accent)"
          />
        </div>
        <div className="card chart-card">
          <p className="card-title">Répartition par catégorie</p>
          {stats.topCategories.length > 0 ? (
            <BarBreakdownChart data={stats.topCategories} />
          ) : (
            <p className="empty-state">Pas encore de catégorie à afficher.</p>
          )}
        </div>
      </div>

      {/* Tableaux */}
      {/* <div >
        <div className="card">
          <p className="card-title">Derniers utilisateurs</p>
          <table className="table">
            <thead>
              <tr className="table-head-row">
                <th>Nom</th>
                <th>Rôle</th>
                <th>Inscription</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((u) => (
                <tr key={u.id} className="table-row">
                  <td>
                    <div className="user-name-cell">
                      <span className="avatar-chip">{getUserInitials(u)}</span>
                      <div>
                        <p className="table-primary-text">{u.prenom} {u.nom}</p>
                        <p className="table-secondary-text">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${ROLE_BADGE_CLASS[u.role.nomRole] ?? ''}`}>{u.role.nomRole}</span>
                  </td>
                  <td className="table-secondary-text">{dateFormatter.format(new Date(u.dateCreation))}</td>
                  <td className={u.statut === 'ACTIF' ? 'status-active' : 'status-inactive'}>
                    {u.statut === 'ACTIF' ? 'Actif' : 'Inactif'}
                  </td>
                </tr>
              ))}
              {stats.recentUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-state">Aucun utilisateur pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <p className="card-title">Derniers articles</p>
          <table className="table">
            <thead>
              <tr className="table-head-row">
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentArticles.map((article) => (
                <tr key={article.id} className="table-row">
                  <td className="table-primary-text article-title-cell">{article.titre}</td>
                  <td className="table-secondary-text">{CATEGORY_META[article.categorie]?.label ?? article.categorie}</td>
                  <td>
                    <span className={`status-badge ${STATUS_BADGE_CLASS[article.statut]}`}>
                      {STATUS_LABEL[article.statut]}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentArticles.length === 0 && (
                <tr>
                  <td colSpan={3} className="empty-state">Aucun article pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
