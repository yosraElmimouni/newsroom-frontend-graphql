import type { ChatbotAi } from "../../ai-assistant/types";
import type { article } from "../../articles/types";
import type { MediaItem } from "../../capture/types";
import type { Revision } from "../../notification/types";


export type Role = 'CELLULE_VALIDATION' | 'EQUIPE_MEDIA' | 'JOURNALISTE' | 'ADMIN';
export interface User{
    id: number;
    nom: string;
    prenom: string;
    email: string;
    moteDePasse?: string;
    status?:string;
    dateCreation?: Date;
    role:Role;
    notifications?: Notification[];
    revisions?: Revision[];
    articles?: article[];
    medias?: MediaItem[];
    analyses?: ChatbotAi[];
}