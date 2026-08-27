import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROLE_LABEL, ROLE_OPTIONS } from "../data/mockUser";
import type { Role } from "../../auth/types";
import "./../style/user.css";
import { useUserById } from "../data/usersData";
export default function AddUserPage() {
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("JOURNALISTE");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { user, loading, error } = useUserById(Number(id));
  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitted(true);
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
  const handleModifierUser = () => {
    if (id) {
      navigate(`/utilisateurs/modifier/${id}`);
    }
  };
   if (loading) return <div className="page">Chargement des utilisateurs...</div>;
  if (error)
    return (
      <div className="page">
        Erreur lors du chargement des utilisateurs : {error.message}
      </div>
    );

  if (isSubmitted) {
    return (
      <div className="page">
        <div className="success-card">
          <div className="success-icon-wrapper">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="success-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="success-title">Utilisateur créé</h1>
          <p className="success-subtitle">
            {prenom} {nom} a été ajouté en tant que{" "}
            {ROLE_LABEL[role].toLowerCase()}.
          </p>
          <div className="success-actions">
            <button
              type="button"
              onClick={() => navigate("/utilisateurs")}
              className="btn-primar-modifier"
            >
              Retour aux utilisateurs
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setNom("");
                setPrenom("");
                setEmail("");
                setRole("JOURNALISTE");
              }}
              className="btn-secondary"
            >
              Ajouter un autre utilisateur
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-info">
          <Link to="/utilisateurs" className="page-header-back-link">
            <BackIcon />
            <div>Retour aux utilisateurs</div>
          </Link>

          <h1 className="page-title">Détail de l'utilisateur</h1>

          <p className="page-subtitle">
            Voir les informations de l'utilisateur.
          </p>
        </div>

        <button
          type="button"
          onClick={handleModifierUser}
          className="btn-primary"
        >
          Modifier l'utilisateur
        </button>
      </div>

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prenom" className="form-label">
              Prénom
            </label>
            <div id="prenom" className="form-input">
              {user?.prenom || "-"}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="nom" className="form-label">
              Nom
            </label>
            <div id="nom" className="form-input">
              {user?.nom || "-"}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div id="email" className="form-input">
            {user?.email || "-"}
          </div>
        </div>

        <div className="form-group form-group--role">
          <label htmlFor="role" className="form-label">
            Rôle
          </label>
          <div id="role" className="form-input">
            {user?.role ? user.role.nomRole : "-"}
          </div>
        </div>
      </form>
    </div>
  );
}
