import { Criteria } from './CriteriaModel';
import { Categories } from './CategoryModel';
import { Ballots } from './BallotModel';
import { Projects } from './ProjectModel';
import { ProjectCategories } from './ProjectCategoriesModel';
import { Users } from './UserModel';

export async function sync(): Promise<void> {
    Categories.hasMany(Criteria, {
        foreignKey: 'category_id',
        sourceKey: 'category_id',
    });
    Ballots.belongsTo(Users, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
    });
    Ballots.belongsTo(Criteria, {
        foreignKey: 'criteria_id',
        onDelete: 'CASCADE',
    });
    Ballots.belongsTo(Projects, {
        foreignKey: 'project_id',
        onDelete: 'CASCADE',
    });
    Projects.belongsToMany(Categories, {
        through: ProjectCategories,
        foreignKey: 'project_id',
        onDelete: 'CASCADE',
    });
    Categories.belongsToMany(Projects, {
        through: ProjectCategories,
        foreignKey: 'category_id',
        onDelete: 'CASCADE',
    });

    const parameters = {
        // logging: console.log,
        // force: true,
    }

    await Categories.sync(parameters);
    await Criteria.sync(parameters);
    await Users.sync(parameters);
    await Projects.sync(parameters);
    await ProjectCategories.sync(parameters);
    await Ballots.sync(parameters);
}
