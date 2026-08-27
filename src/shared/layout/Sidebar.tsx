import { Label } from '@radix-ui/react-dropdown-menu';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Administration', to: '/admin' },
  { label: 'Utilisateurs', to: '/utilisateurs' },
  { label: 'Articles', to: '/articles' },
  { label: 'Médias', to: '/medias' },
  { label: 'Agenda', to: '/agenda' },
  { label: 'Veille info', to: '/veille-info' },
  
];

export function Sidebar() {
  return (
    <nav className="app-sidebar">
      <span className="app-sidebar-eyebrow">Espace Administrateur</span>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `app-sidebar-link ${isActive ? 'is-active' : ''}`}
        >
          <span className="app-sidebar-dot" aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
