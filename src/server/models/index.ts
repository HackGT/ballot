import { Criteria } from './CriteriaModel';
import { Categories } from './CategoryModel';
import { Ballots } from './BallotModel';
import { Projects } from './ProjectModel';
import { Users } from './UserModel';
import { Logger } from '../util/Logger';

const logger = Logger('models:sync');

export async function sync(): Promise<void> {
    Criteria.belongsTo(Categories, { foreignKey: 'category_id' });
    Categories.hasMany(Criteria,
        { foreignKey: 'category_id', sourceKey: 'category_id' });

    const promises = [
        Categories.sync(),
        Criteria.sync(),
        Projects.sync(),
        Users.sync(),
        Ballots.sync(),
    ];

    Promise.all(promises as any)
        .catch((err) => {
            logger.error(err);
        });
}
