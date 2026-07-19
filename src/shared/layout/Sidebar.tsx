import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Articles', to: '/articles' },
  { label: 'Agenda', to: '/agenda' },
  { label: 'Veille info', to: '/veille-info' },
  { label: 'Médias', to: '/medias' },
  { label: 'Administration', to: '/admin' },
];

export function Sidebar() {
  return (
    <nav className="flex w-56 flex-col gap-1 border-r border-gray-200 bg-white p-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `rounded-md px-3 py-2 text-sm ${
              isActive ? 'bg-teal-50 font-medium text-teal-800' : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
