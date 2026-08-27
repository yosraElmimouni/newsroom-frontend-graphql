import { useState, type SyntheticEvent } from 'react';
import { useMutation } from '@apollo/client/react';
import { useMsal } from '@azure/msal-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LOGIN_MUTATION, MICROSOFT_LOGIN_MUTATION } from '../../../core/api/auth.mutations';
import type { AuthUser } from '../../../core/auth/AuthContext';
import { loginRequest } from '../../../core/auth/msalConfig';
import { useAuth } from '../../../core/auth/useAuth';

interface LoginMutationData {
  login: {
    accessToken: string;
    user: AuthUser;
  };
}

interface LoginMutationVariables {
  email: string;
  password: string;
}

interface MicrosoftLoginData {
  microsoftLogin: {
    accessToken: string;
    user: AuthUser;
  };
}

interface MicrosoftLoginVariables {
  idToken: string;
}

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [msLoading, setMsLoading] = useState(false);
  const [msError, setMsError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { instance } = useMsal();

  const [loginMutation, { loading, error }] = useMutation<
    LoginMutationData,
    LoginMutationVariables
  >(LOGIN_MUTATION);

  const [microsoftLoginMutation] = useMutation<
    MicrosoftLoginData,
    MicrosoftLoginVariables
  >(MICROSOFT_LOGIN_MUTATION);

  function redirectAfterLogin() {
    const redirectTo =
      (location.state as { from?: Location })?.from?.pathname ??
      '/admin';

    navigate(redirectTo, { replace: true });
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const { data } = await loginMutation({
        variables: {
          email,
          password,
        },
      });

      if (!data) {
        throw new Error('Réponse vide');
      }

      login(data.login.accessToken, data.login.user);
      redirectAfterLogin();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMicrosoftLogin() {
    setMsError(null);
    setMsLoading(true);

    try {
      const result = await instance.loginPopup(loginRequest);

      const { data } = await microsoftLoginMutation({
        variables: {
          idToken: result.idToken,
        },
      });

      if (!data) {
        throw new Error('Réponse vide');
      }

      login(
        data.microsoftLogin.accessToken,
        data.microsoftLogin.user,
      );

      redirectAfterLogin();
    } catch (err) {
      console.error(err);
      setMsError("La connexion Microsoft a échoué.");
    } finally {
      setMsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--brand-bg-alt)] flex items-center justify-center p-6">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-[var(--brand-border)] p-8">

        <div className="text-center mb-8">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--brand-ink)] text-white text-xl font-bold">
            N
          </div>

          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent-soft-text)]">
            Espace Administrateur
          </p>

          <h1 className="text-3xl font-bold text-[var(--brand-ink)]">
            Newsroom
          </h1>

          <p className="mt-2 text-sm text-[var(--brand-muted)]">
            Connectez-vous pour accéder à votre espace de travail.
          </p>

        </div>

        <button
          type="button"
          onClick={handleMicrosoftLogin}
          disabled={msLoading}
          className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--brand-border-strong)] bg-white py-3 font-medium text-[var(--brand-text)] transition hover:bg-[var(--brand-bg-alt)] disabled:opacity-60"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 21 21"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>

          {msLoading
            ? 'Connexion Microsoft...'
            : 'Continuer avec Microsoft'}
        </button>

        {msError && (
          <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {msError}
          </div>
        )}

        <div className="relative mb-6">
          <div className="border-t border-[var(--brand-border)]"></div>

          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-[var(--brand-muted)]">
            ou
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[var(--brand-text)]"
            >
              Adresse e-mail
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--brand-border-strong)] px-4 py-3 outline-none transition focus:border-[var(--brand-accent)] focus:ring-1 focus:ring-[var(--brand-accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[var(--brand-text)]"
            >
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--brand-border-strong)] px-4 py-3 outline-none transition focus:border-[var(--brand-accent)] focus:ring-1 focus:ring-[var(--brand-accent)]"
            />
          </div>
                    {error && (
            <div className="rounded-lg bg-[var(--brand-danger-soft)] border border-red-200 p-3 text-sm text-[var(--brand-danger)]">
              Identifiants incorrects. Vérifiez votre adresse e-mail et votre
              mot de passe.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--brand-accent)] py-3 font-medium text-white transition hover:bg-[var(--brand-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-8 border-t border-[var(--brand-border)] pt-6 text-center">
          <p className="text-xs text-[var(--brand-muted)]">
            Newsroom · Plateforme de gestion des veilles et des publications
          </p>
        </div>

      </div>
    </div>
  );
}