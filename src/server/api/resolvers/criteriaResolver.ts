import { CriteriaModel } from '../../models/CriteriaModel';
import { CriteriaService } from '../../controllers/CriteriaService';
import { CriterionUpdate } from '../types/criteria';


const resolvers = {
    Query: {
        criteria: async (obj: any, args: any, context: any) => {
            let criteria: CriteriaModel[];
            criteria = await CriteriaService.find();
            return criteria;
        },
    },
    Mutation: {
        addCriterion: async (obj: any, args: any, context: any) => {
            const criterion =
                await CriteriaService.create(args as CriteriaModel);
            return criterion;
        },
        updateCriterion: async (obj: any,
                                args: {criteria_id?: number,
                                    update?: CriterionUpdate},
                                context: any) => {
            const updated = await CriteriaService.update(args.criteria_id!,
                                                        args.update!);
            return updated;
        },
    },
};

export default resolvers;
