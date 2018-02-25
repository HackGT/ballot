import { CategoryService } from '../../controllers/CategoryService';
import { ICriteriaModel } from '../../models/CriteriaModel';


const resolvers = {
    Query: {
        getCriteria: async (obj: any, args: any, context: any) => {
            let criteria: ICriteriaModel[];
            criteria = await CategoryService.getCriteria(args.category_id);
            console.log(criteria);
            return criteria;
        },
    },
};

export default resolvers;
