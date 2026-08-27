

import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_MEDIAS_MUTATION, DELETE_MEDIA_MUTATION, GET_MEDIAS_QUERY, UPDATE_MEDIA_MUTATION } from '../../../core/api/capture.mutations';
export function useMedias() {
  const { data, loading, error } = useQuery(GET_MEDIAS_QUERY);
  return {
    medias: data?.medias ?? [],
    loading,
    error,
  };
}
export function useCreateMedia() {
  return useMutation(CREATE_MEDIAS_MUTATION, {
    refetchQueries: [GET_MEDIAS_QUERY],
  });
}

export function useUpdateMedia() {
  return useMutation(UPDATE_MEDIA_MUTATION, {
    refetchQueries: [GET_MEDIAS_QUERY],
  });
}

export function useMediaById(id: number) {
  const { data, loading, error } = useQuery(GET_MEDIAS_QUERY);
  const media = data?.medias.find((media: { id: number }) => media.id === id);
  return {
    media,
    loading,
    error,
  };
}

export function useDeleteMedia() {
  return useMutation(DELETE_MEDIA_MUTATION, {
    refetchQueries: [GET_MEDIAS_QUERY],
  });
}

