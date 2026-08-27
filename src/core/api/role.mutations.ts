import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { Role } from '../../features/auth/types';

interface RoleData {
  id: number;
  nomRole: Role;
}

interface GetRolesData {
  roles: RoleData[];
}

export const GET_ROLES_QUERY: TypedDocumentNode<GetRolesData> = gql`
  query GetRoles {
    roles {
      id
      nomRole
    }
  }
`;