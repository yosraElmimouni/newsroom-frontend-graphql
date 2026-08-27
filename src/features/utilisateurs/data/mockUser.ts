import type { User, Role } from '../../auth/types';

export const ROLE_OPTIONS: Role[] = ['ADMIN', 'CELLULE_VALIDATION', 'EQUIPE_MEDIA', 'JOURNALISTE'];

export const ROLE_LABEL: Record<Role, string> = {
  CELLULE_VALIDATION : 'CELLULE_VALIDATION',
  EQUIPE_MEDIA : 'EQUIPE_MEDIA',
  JOURNALISTE : 'JOURNALISTE',
  ADMIN        : 'ADMIN',
};

export const STATUS_OPTIONS = ['ACTIF', 'INACTIF'] as const;


export function getUserInitials(user: Pick<User, 'nom' | 'prenom'>): string {
  return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
}