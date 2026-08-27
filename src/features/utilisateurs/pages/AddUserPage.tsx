import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROLE_LABEL, ROLE_OPTIONS } from "../data/mockUser";
import type { Role } from "../../auth/types";

import "./../style/user.css";
import { useCreateUser, useUpdateUser, useUserById } from "../data/usersData";
import { useRoles } from "../data/useRoles";

export default function AddUserPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, error } = useUserById(Number(id));
  const [nom, setNom] = useState(user?.nom || "");
  const [prenom, setPrenom] = useState(user?.prenom || "");
  const [email, setEmail] = useState(user?.email || "");
  const [statut, setStatut] = useState<"ACTIF" | "INACTIF">(
    user?.statut || "ACTIF",
  );
  const [role, setRole] = useState<Role | "">(
    user?.role?.nomRole ?? "JOURNALISTE",
  );
  const [password, setPassword] = useState("");

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createUser, { loading: creating, error: createError }] =
    useCreateUser();
  const [updateUser, { loading: updating, error: updateError }] =
    useUpdateUser();
  const loading = creating || updating;
  const mutationError = createError || updateError;
  const isEditMode = Boolean(id);
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();
  console.log({ roles, rolesLoading, rolesError });

  async function saveUser() {
    if (!isEditMode || password) {
      // On valide la confirmation seulement si un mot de passe est saisi
      // (en édition, un champ vide = "je ne change pas le mot de passe")
      if (password !== passwordConfirm) {
        console.error("Les mots de passe ne correspondent pas");
        return;
      }
    }

    const selectedRole = roles.find((r) => r.nomRole === role);
    if (!selectedRole) {
      console.error("Rôle invalide ou introuvable");
      return;
    }
    console.log("roles chargés:", roles);
    console.log("role sélectionné (state):", role);

    if (!selectedRole) {
      console.error("Rôle invalide ou introuvable");
      return;
    }

    try {
      if (isEditMode) {
        await updateUser({
          variables: {
            updateUserInput: {
              id: Number(id),
              nom,
              prenom,
              email,
              roleId: selectedRole.id,
              statut,
              ...(password ? { motDePasse: password } : {}),
            },
          },
        });
      } else {
        await createUser({
          variables: {
            createUserInput: {
              nom,
              prenom,
              email,
              roleId: selectedRole.id,
              motDePasse: password,
            },
          },
        });
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur", err);
    }
  }
  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    saveUser();
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
  if (loading)
    return <div className="page">Chargement des utilisateurs...</div>;
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
            {prenom} {nom} a été ajouté en tant que {role?.toLowerCase()}.
          </p>
          <div className="success-actions">
            <button
              type="button"
              onClick={() => navigate("/utilisateurs")}
              className="btn-primary"
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
      <div>
        <Link to="/utilisateurs" className="page-header-back-link">
          <BackIcon />
          <div>Retour aux utilisateurs</div>
        </Link>
        {user && (
          <>
            <h1 className="page-title">Modifier l'utilisateur</h1>
            <p className="page-subtitle">
              Modifier les informations de l'utilisateur.
            </p>
          </>
        )}
        {!user && (
          <>
            <h1 className="page-title">Nouvel utilisateur</h1>
            <p className="page-subtitle">
              Créer un compte et lui attribuer un rôle dans la rédaction.
            </p>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prenom" className="form-label">
              Prénom
            </label>
            <input
              id="prenom"
              type="text"
              required
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nom" className="form-label">
              Nom
            </label>
            <input
              id="nom"
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom.nom@newsroom.fr"
            className="form-input"
          />
        </div>

        { role !== 'ADMIN' && (
          <div className="form-group form-group--role">
          <label htmlFor="role" className="form-label">
            Rôle
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="form-select"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </div>)}
        {user &&  role !== 'ADMIN' && (
          <div className="form-group form-group--role">
            <label htmlFor="statut" className="form-label">
              Statut
            </label>
            <select
              id="statut"
              value={statut}
              onChange={(e) =>
                setStatut(e.target.value as "ACTIF" | "INACTIF")
              }
              className="form-select"
            >
              <option value="ACTIF">Actif</option>
              <option value="INACTIF">Inactif</option>
            </select>
          </div>
        )}

        {/* password */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required={!isEditMode}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isEditMode ? "Laisser vide pour ne pas changer" : ""}
            className="form-input"
          />
        </div>

        {/* verification du password */}
        <div className="form-group">
          <label htmlFor="passwordConfirm" className="form-label">
            Confirmer le mot de passe
          </label>
          <input
            id="passwordConfirm"
            type="password"
            required={!isEditMode}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder={isEditMode ? "Laisser vide pour ne pas changer" : ""}
            className="form-input"
          />
        </div>

        {mutationError && (
          <div className="form-error">
            Erreur lors de l'enregistrement de l'utilisateur :{" "}
            {mutationError.message}
          </div>
        )}

        <div className="form-actions">
          {user && (
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || rolesLoading}
            >
              Mettre à jour l'utilisateur
            </button>
          )}
          {!user && (
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || rolesLoading}
            >
              Créer l'utilisateur
            </button>
          )}

          <Link to="/utilisateurs" className="btn-primary-annuler">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
