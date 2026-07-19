import { useState, type SyntheticEvent } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LOGIN_MUTATION } from '../api/auth.mutations';
import { useAuth } from '../../../core/auth/useAuth';
import type { AuthUser } from '../../../core/auth/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const [loginMutation, { loading, error }] = useMutation<LoginMutationData, LoginMutationVariables>(LOGIN_MUTATION);

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    login('fake-dev-token', {
      id: 0,
      email: email || 'dev@newsroom.local',
      role: { id: 1, name: 'Administrateur' },
    });

    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/articles';
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-6 text-lg font-medium text-gray-900">Connexion Newsroom</h1>

        <div className="mb-4">
          <label htmlFor="email" className="mb-1 block text-sm text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-1 block text-sm text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600">
            Identifiants incorrects. Réessaie.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-teal-700 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}