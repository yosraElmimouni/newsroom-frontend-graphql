import { useMutation, useQuery } from "@apollo/client/react";
import {
  CREATE_EVENT_MUTATION,
  GET_AGENDA_QUERY,
  UPDATE_EVENT_MUTATION,
  DELETE_EVENT_MUTATION,
} from "../../../core/api/agenda.mutations";
import { GET_SOURCES_QUERY } from "../../../core/api/SourceItem.mutations";

export function useEvents() {
  const { data, loading, error } = useQuery(GET_AGENDA_QUERY);
  return {
    events: data?.agendas ?? [],
    loading,
    error,
  };
}
export function useCreateEvent() {
  return useMutation(CREATE_EVENT_MUTATION, {
    refetchQueries: [GET_AGENDA_QUERY],
  });
}

export function useEventById(id: number) {
  const { data, loading, error } = useQuery(GET_AGENDA_QUERY);
  const event = data?.agendas.find((event: { id: number }) => event.id === id);
  return {
    event,
    loading,
    error,
  };
}

export function useUpdateEvent() {
  return useMutation(UPDATE_EVENT_MUTATION, {
    refetchQueries: [GET_AGENDA_QUERY],
  });
}

export function useDeleteEvent() {
  return useMutation(DELETE_EVENT_MUTATION, {
    refetchQueries: [GET_AGENDA_QUERY],
  });
}

export function useSources() {
  const { data, loading, error } = useQuery(GET_SOURCES_QUERY);
  return {
    sources: data?.sources ?? [],
    loading,
    error,
  };
}
