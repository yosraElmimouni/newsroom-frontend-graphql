import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ROLE_LABEL,
  ROLE_OPTIONS,
  getUserInitials,
} from "../data/mockUser";
import type { Role } from "../../auth/types";
import { useUsers } from "../data/usersData";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const navigate = useNavigate();
  const { users, loading, error } = useUsers();

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        `${u.prenom} ${u.nom}`.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !roleFilter || u.role.nomRole === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  if (loading) return <div className="page">Chargement des articles...</div>;
  if (error)
    return (
      <div className="page">
        Erreur lors du chargement des articles : {error.message}
      </div>
    );

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Utilisateurs</h1>
          <p className="text-sm text-gray-500">
            Gérer les comptes et les rôles de l'équipe éditoriale.
          </p>
        </div>
        <Link to="/utilisateurs/nouveau" className="btn-primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14M5 12h14"
            />
          </svg>
          Nouvel utilisateur
        </Link>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un nom ou un email"
          className="search-input"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as Role | "")}
          className="filter-select"
        >
          <option value="">Tous les rôles</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABEL[role]}
            </option>
          ))}
        </select>
        <span className="filter-count">
          {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="articles-table-wrapper">
        {filtered.length === 0 ? (
          <div className="empty-state">
            Aucun utilisateur ne correspond à cette recherche.
          </div>
        ) : (
          <table className="articles-table">
            <thead>
              <tr>
                <th>   </th>
                <th>Nom</th>
                <th>Prenom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Créé le</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => {
                    navigate(`/utilisateurs/${u.id}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div className="user-name-cell">
                      <span className="user-avatar">{getUserInitials(u)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="user-name-cell">
                      <span className="article-title-cell">{u.nom}</span>
                    </div>
                  </td>
                  <td>
                    <div className="user-name-cell">
                      <span className="article-title-cell">{u.prenom}</span>
                    </div>
                  </td>
                  <td className="article-author-cell">{u.email}</td>
                  <td>
                    <span
                      className={`role-badge role-${u.role.nomRole.toLowerCase().replace(/_/g, "-")}`}
                    >
                      {u.role.nomRole}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        u.statut === "ACTIF"
                          ? "status-badge status-valide"
                          : "status-badge status-archive"
                      }
                    >
                      {u.statut ?? "ACTIF"}
                    </span>
                  </td>
                  <td className="article-date-cell">
                    {u.dateCreation
                      ? new Date(u.dateCreation).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
