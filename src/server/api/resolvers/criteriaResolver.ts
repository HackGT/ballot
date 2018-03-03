import { CriteriaModel, Criteria } from '../../models/CriteriaModel';
import { CriteriaService } from '../../controllers/CriteriaService';

const resolvers = {
    Query: {
        criteria: async (obj: any, args: any, context: any) => {
            let criteria: Criteria[];
            criteria = await CriteriaService.find();
            return criteria;
        },
    },
};

export default resolvers;
