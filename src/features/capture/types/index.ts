import type { article } from "../../articles/types";
import type { User } from "../../auth/types";


export type MediaType = 'Image' | 'Video' |'Audio' ;

export interface MediaItem {
  id: number;
  titre: string;
  type: MediaType;
  urlFichier:string;
  description: string;
  localisation: string;
  dateCapture: Date;
  article?: article;
  user:User;
}
