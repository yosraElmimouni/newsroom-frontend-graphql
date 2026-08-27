import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_ARTICLE_MUTATION, GET_ARTICLES_QUERY, UPDATE_ARTICLE_MUTATION } from '../../../core/api/article.mutations';

export function useArticles() {
  const { data, loading, error } = useQuery(GET_ARTICLES_QUERY);
  return {
    articles: data?.articles ?? [],
    loading,
    error,
  };
}
export function useCreateArticle() {
  return useMutation(CREATE_ARTICLE_MUTATION, {
    refetchQueries: [GET_ARTICLES_QUERY],
  });
}

export function useUpdateArticle() {
  return useMutation(UPDATE_ARTICLE_MUTATION);
}

export function useArticleById(id: number) {
  const { data, loading, error } = useQuery(GET_ARTICLES_QUERY);
  const article = data?.articles.find((article: { id: number }) => article.id === id);
  return {
    article,
    loading,
    error,
  };
}