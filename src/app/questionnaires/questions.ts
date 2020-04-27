export class Questions {
    id: string;
    question: string;
    consignes: string;
    reponses: string[];
    ordre: number;
    active: boolean;
    croix: boolean;
    idOfQuestionnaire: string;
    timestamp?: number;
}
