import { NavLink } from "react-router-dom";
import { useAuth } from "../../core/auth/useAuth";

const NAV_ITEMS = [
  { label: "Administration", to: "/admin" },
  { label: "Utilisateurs", to: "/utilisateurs" },
  { label: "Articles", to: "/articles" },
  { label: "Médias", to: "/medias" },
  { label: "Agenda", to: "/agenda" },
  { label: "Veille info", to: "/veille-info" },
];

type SidebarProps = {
  handleClick?: () => void;
};

export function Sidebar({ handleClick }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <nav className="app-sidebar">
      <span className="app-sidebar-eyebrow">Espace Administrateur</span>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={handleClick}
          className={({ isActive }) =>
            `app-sidebar-link ${isActive ? "is-active" : ""}`
          }
        >
          <span className="app-sidebar-dot" aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
      <footer className="app-sidebar-footer">
        <p className="app-sidebar-user">{user?.email}</p>
      </footer>
    </nav>
  );
}