export default interface Category {
    id?: number;
    name: string;
    isDefault: boolean;
    criteria: Criteria[];
}

export interface Criteria {
    id?: number;
    name: string;
    rubric: string;
    minScore: number;
    maxScore: number;
}
