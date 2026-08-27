import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../../core/auth/useAuth';

export function Header() {
  const { user, logout } = useAuth();
  const initial = user?.email?.charAt(0) ?? '?';

  return (
    <header className="app-header">
      <div className="app-header-brand">
        <span className="app-header-mark">N</span>
        <span className="app-header-title">Newsroom</span>
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="app-header-user">
            <span className="app-header-avatar">{initial}</span>
            {user?.email}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="app-header-menu data-[state=open]:animate-in data-[state=open]:fade-in"
          >
            <DropdownMenu.Item className="app-header-menu-role">{user?.role.name}</DropdownMenu.Item>
            <DropdownMenu.Separator className="app-header-menu-sep" />
            <DropdownMenu.Item onSelect={logout} className="app-header-menu-logout">
              Se déconnecter
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  );
}
