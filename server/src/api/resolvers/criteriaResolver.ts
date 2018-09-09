import { CriteriaModel } from '../../models/CriteriaModel';
import { CriteriaService } from '../../controllers/CriteriaService';
import { CriterionUpdate } from '../types/criteria';
import { Action } from '../../util/Permissions';

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
        deleteCriterion: async (obj: any, args: any, context: any) => {
            if (!context.user || !context.user.can(Action.DeleteCriterion)) {
                throw new Error('You do not have permission to delete criteria');
            }

            if (args.criteria_id) {
                CriteriaService.delete(args.criteria_id);
            } else {
                throw new Error('Must specify criteria_id');
            }
        },
    },
};

export default resolvers;
