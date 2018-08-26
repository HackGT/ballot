export enum ViewType {
    byCriteria,
    byCategory,
}

export interface ProjectRanking {
    name: string;
    project_id: string;
    score: number;
    judge_count: number;
    devpost_id: string;
}

export interface CategoryRanking {
    category_id: string;
    category_name: string;
    ranking: ProjectRanking[];
}

export interface CriteriaRanking {
    criteria_id: string;
    criteria_name: string;
    category_id: string;
    category_name: string;
    ranking: ProjectRanking[];
}

interface CategoryRankingBuild {
    category_id: string;
    category_name: string;
    ranking: { [projectId: string]: ProjectRanking };
}

export function rankCriteriaToCategory(ranking: CriteriaRanking[]):
    CategoryRanking[] {
    const categories: { [categoryId: string]: CategoryRankingBuild } = {};

    for (const criteria of ranking) {
        if (!(criteria.category_id in categories)) {
            categories[criteria.category_id] = {
                category_name: criteria.category_name,
                category_id: criteria.category_id,
                ranking: {},
            };
        }
        const category = categories[criteria.category_id];

        for (const project of criteria.ranking) {
            if (project.project_id in category.ranking) {
                category.ranking[project.project_id].score += project.score;
            } else {
                category.ranking[project.project_id] = {
                    name: project.name,
                    project_id: project.project_id,
                    judge_count: project.judge_count,
                    score: project.score,
                    devpost_id: project.devpost_id,
                };
            }
        }
    }

    const ret: CategoryRanking[] = [];
    for (const i in categories) {
        if (categories.hasOwnProperty(i)) {
            const category = categories[i];
            const arr = [];
            for (const j in category.ranking) {
                if (category.ranking.hasOwnProperty(j)) {
                    arr.push(category.ranking[j]);
                }
            }
            ret.push({
                ...category,
                ranking: arr,
            });
        }
    }

    return ret;
}
