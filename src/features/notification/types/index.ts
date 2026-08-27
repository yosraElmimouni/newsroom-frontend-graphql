import type { article } from "../../articles/types";
import type { User } from "../../auth/types";


export interface Notification {
  id: number;
  message: string;
  type:string;
  lu: boolean;
  dateEnvoi: Date;
  user:User
}

export interface Revision {
  id: number;
  dateRevision: Date;
  commentaire: string;
  user: User;
  article:article;
}