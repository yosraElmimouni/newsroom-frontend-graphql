import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../../core/auth/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <span className="text-sm font-medium text-gray-900">Newsroom</span>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 outline-none hover:bg-gray-100 data-[state=open]:bg-gray-100">
            {user?.email}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="min-w-[180px] rounded-md border border-gray-200 bg-white p-1 shadow-md data-[state=open]:animate-in data-[state=open]:fade-in"
          >
            <DropdownMenu.Item className="rounded px-2 py-1.5 text-sm text-gray-500 outline-none">
              {user?.role.name}
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />
            <DropdownMenu.Item
              onSelect={logout}
              className="cursor-pointer rounded px-2 py-1.5 text-sm text-red-600 outline-none hover:bg-red-50 data-[highlighted]:bg-red-50"
            >
              Se déconnecter
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  );
}
