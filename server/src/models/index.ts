import { Criteria } from './CriteriaModel';
import { Categories } from './CategoryModel';
import { Ballots } from './BallotModel';
import { Projects } from './ProjectModel';
import { Users } from './UserModel';
import { Logger } from '../util/Logger';

const logger = Logger('models:sync');

export async function sync(): Promise<void> {
    Criteria.hasOne(Categories, { foreignKey: 'category_id' });
    Categories.hasMany(Criteria,
        { foreignKey: 'category_id', sourceKey: 'category_id' });

    Ballots.belongsTo(Users, {
        foreignKey: 'user_id',
    });
    Ballots.belongsTo(Criteria, {
        foreignKey: 'criteria_id',
    });
    Ballots.belongsTo(Projects, {
        foreignKey: 'project_id',
    });

    Projects.belongsToMany(Categories, {
        through: 'project_categories',
        foreignKey: 'project_id',
        onDelete: 'CASCADE',
    });
    Categories.belongsToMany(Projects, {
        through: 'project_categories',
        foreignKey: 'category_id',
        onDelete: 'CASCADE',
    });

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
