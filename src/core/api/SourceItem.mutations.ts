import { gql, type TypedDocumentNode } from '@apollo/client';

interface SourceItem {
  id: number;
  nom: string;
  url: string;
}

interface GetSourcesData {
  sources: SourceItem[];
}

export const GET_SOURCES_QUERY: TypedDocumentNode<GetSourcesData> = gql`
  query GetSources {
    sources {
      id
      nom
      url
    }
  }
`;