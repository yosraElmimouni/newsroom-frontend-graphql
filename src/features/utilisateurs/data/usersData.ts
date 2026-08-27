

import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_USER_MUTATION, GET_USERS_QUERY, UPDATE_USER_MUTATION } from '../../../core/api/user.mutation';

export function useUsers() {
  const { data, loading, error } = useQuery(GET_USERS_QUERY);
  return {
    users: data?.users ?? [],
    loading,
    error,
  };
}
export function useCreateUser() {
  return useMutation(CREATE_USER_MUTATION, {
    refetchQueries: [GET_USERS_QUERY],
  });
}

export function useUpdateUser() {
  return useMutation(UPDATE_USER_MUTATION);
}

export function useUserById(id: number) {
  const { data, loading, error } = useQuery(GET_USERS_QUERY);
  const user = data?.users.find((user: { id: number }) => user.id === id);
  return {
    user,
    loading,
    error,
  };
}