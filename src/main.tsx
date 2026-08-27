import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './core/auth/msalConfig';

async function bootstrap() {
  await msalInstance.initialize();
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  );
}
bootstrap();
