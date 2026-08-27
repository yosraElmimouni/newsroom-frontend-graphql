import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-shell-body">
        <Sidebar />
        <main className="app-shell-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
