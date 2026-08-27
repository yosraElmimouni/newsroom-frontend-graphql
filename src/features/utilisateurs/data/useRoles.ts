import { useQuery } from '@apollo/client/react';
import { GET_ROLES_QUERY } from '../../../core/api/role.mutations';

export function useRoles() {
  const { data, loading, error } = useQuery(GET_ROLES_QUERY);
  return { roles: data?.roles ?? [], loading, error };
}

