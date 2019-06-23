import * as bodyParser from 'body-parser';
import { can, Action } from '../config/Permissions';
import { Router } from 'express';
import Authentication from '../config/Authentication';

const postParser = bodyParser.urlencoded({
    extended: false,
});

const router: Router = Router();

// Get
router.get('/projects', async (req, res) => {
    if (can(req.user, Action.ViewProjects)) {
        // const projects = await Project.query().select([
        //     'id', 'name', 'devpostURL', 'expoNumber', 'tableGroup', 'tableNumber',
        //     'sponsorPrizes',
        // ]);

        // return res.status(200).json(projects);
    }

    return res.status(401).send('Unauthorized');
});

// Batch upload projects
router.put('/projects', postParser, async (req, res) => {
    try {
        if (can(req.user, Action.AddProject)) {
            // if (req.body.projects) {
            //     const toInsert: {
            //         name: string;
            //         devpostURL: string;
            //         expoNumber: number;
            //         tableGroup: string;
            //         tableNumber: string;
            //         sponsorPrizes: string;
            //         tags: string;
            //     }[] = [];
            //     const projectCategories: {
            //         projectID: number;
            //         categoryID: number;
            //     }[] = [];
            //     const categories = await Category.query();
            //     const categoryNames: { [name: string]: number } = {};
            //     for (const category of categories) {
            //         categoryNames[category.name] = category.id;
            //     }

            //     for (const project of req.body.projects) {
            //         toInsert.push({
            //             name: project.name,
            //             devpostURL: project.devpostURL,
            //             expoNumber: project.expoNumber,
            //             tableGroup: project.tableGroup,
            //             tableNumber: project.tableNumber,
            //             sponsorPrizes: project.sponsorPrizes,
            //             tags: project.tags,
            //         });

            //         const projectDesiredPrizes = project.sponsorPrizes.split(', ');
            //         for (const desiredPrize of projectDesiredPrizes) {
            //             if (categoryNames[desiredPrize]) {
            //                 projectCategories.push({
            //                     projectID: project.id,
            //                     categoryID: categoryNames[desiredPrize],
            //                 });
            //             }
            //         }
            //     }
            // }

            return res.status(200).send('Success');
        }
    } catch (err) {
        return res.status(400).send('Error');
    }

    return res.status(400).send('Error');
});

router.post('/projects', async (req, res) => {

});

router.delete('/projects/:id', (req, res) => {

});

// Get
router.get('/users', async (req, res) => {
    if (can(req.user, Action.ViewUsers)) {
        // const users = await User.query().select([
        //     'id', 'name', 'email', 'role', 'tags',
        // ]);

        // return res.status(200).json({
        //     users,
        // });
    }

    return res.status(401).send('Unauthorized');
});

router.post('/users', async (req, res) => {
    if (can(req.user, Action.EditUser)) {
        // console.log(req.body);
        // if (req.body.id && req.body.name && req.body.role) {
        //     if (req.body.password) {
        //         const { salt, hash } = await Authentication.hashPassword(req.body.password);
        //         const users = await User.query().findById(req.body.id).patch({
        //             name: req.body.name,
        //             role: req.body.role,
        //             salt,
        //             hash,
        //         });

        //         return res.status(200).json({
        //             status: true,
        //         });
        //     } else {
        //         const users = await User.query().findById(req.body.id).patch({
        //             name: req.body.name,
        //             role: req.body.role,
        //         });

        //         return res.status(200).json({
        //             status: true
        //         });
        //     }
        // }
    }

    return res.status(401).send('Unauthorized');
});

router.get('/categories', async (req, res) => {
    // if (can(req.user, Action.ViewCategories)) {
        // const [categoryResult, criteriaResult] = await Promise.all([
        //     await Category.query().select('id', 'name', 'isDefault'),
        //     await Criteria.query().select('id', 'name', 'rubric', 'minScore', 'maxScore', 'categoryID'),
        // ]);

        // const result: { [categoryID: number]: {
        //     id: number;
        //     name: string;
        //     isDefault: boolean;
        //     criteria: {
        //         id: number;
        //         name: string;
        //         rubric: string;
        //         minScore: number;
        //         maxScore: number;
        //     }[];
        // }} = {};

        // for (const category of categoryResult) {
        //     result[category.id] = {
        //         id: category.id,
        //         name: category.name,
        //         isDefault: category.isDefault,
        //         criteria: [],
        //     };
        // }

        // for (const criteria of criteriaResult) {
        //     result[criteria.categoryID].criteria.push({
        //         id: criteria.id,
        //         name: criteria.name,
        //         rubric: criteria.rubric,
        //         minScore: criteria.minScore,
        //         maxScore: criteria.maxScore,
        //     });
        // }

        // console.log(result);

        // return res.status(200).json(result);
    // }

    return res.status(400).send('Unauthorized');
});

router.get('/categories/:id', async (req, res) => {
    // if (can(req.user, Action.ViewCategories)) {
        const idRequested = req.params.id;

        // const [categoryResult, criteriaResult] = await Promise.all([
        //     await Category.query().select('id', 'name', 'isDefault').where('id', idRequested),
        //     await Criteria.query().select('id', 'name', 'rubric', 'minScore', 'maxScore', 'categoryID').where('categoryID', idRequested),
        // ]);

        // const result: { [categoryID: number]: {
        //     id: number;
        //     name: string;
        //     isDefault: boolean;
        //     criteria: {
        //         id: number;
        //         name: string;
        //         rubric: string;
        //         minScore: number;
        //         maxScore: number;
        //     }[];
        // }} = {};

        // for (const category of categoryResult) {
        //     result[category.id] = {
        //         id: category.id,
        //         name: category.name,
        //         isDefault: category.isDefault,
        //         criteria: [],
        //     };
        // }

        // for (const criteria of criteriaResult) {
        //     result[criteria.categoryID].criteria.push({
        //         id: criteria.id,
        //         name: criteria.name,
        //         rubric: criteria.rubric,
        //         minScore: criteria.minScore,
        //         maxScore: criteria.maxScore,
        //     });
        // }

        // console.log(result);

        // return res.status(200).json(result);
    // }

    return res.status(400).send('Unauthorized');
});

router.post('/categories', async (req, res) => {
    console.log(req.body);
    // return;
    if (can(req.user, Action.UpdateCategory)) {
        // if (req.body.id && req.body.name) {
        //     if (req.body.criteria.length > 0) {
        //         let updatedCategoryID = req.body.id;
        //         if (updatedCategoryID < 0) {
        //             const category = await Category.query().insert({
        //                 name: req.body.name,
        //                 isDefault: req.body.isDefault,
        //             });
        //             updatedCategoryID = category.id;
        //         }

        //         await Category.query().findById(req.body.id).patch({
        //             name: req.body.name,
        //             isDefault: req.body.isDefault,
        //         });

        //         try {
        //             const newCriteria = req.body.criteria;
        //             for (const criteria of newCriteria) {
        //                 if (criteria.id < 0) {
        //                     await Criteria.query().insert({
        //                         name: criteria.name,
        //                         rubric: criteria.rubric,
        //                         minScore: parseInt(criteria.minScore, 10),
        //                         maxScore: parseInt(criteria.maxScore, 10),
        //                         categoryID: updatedCategoryID,
        //                     });
        //                 } else {
        //                     await Criteria.query().findById(criteria.id).patch({
        //                         name: criteria.name,
        //                         rubric: criteria.rubric,
        //                         minScore: criteria.minScore,
        //                         maxScore: criteria.maxScore,
        //                         categoryID: updatedCategoryID,
        //                     });
        //                 }
        //             }

        //             return res.status(200).send('Successfully created criteria');
        //         } catch (error) {
        //             console.log(error);
        //             return res.status(400).send('Error creating criteria');
        //         }

        //     } else {
        //         return res.status(400).send('Categories must have at least one criteria');
        //     }
        // } else {
        //     return res.status(400).send('Missing information');
        // }
    }

    return res.status(401).send('Unauthorized');
});

router.delete('/categories/:id', async (req, res) => {
    const idRequested = req.params.id;

    console.log(idRequested);

    // if (can(req.user, Action.DeleteCategory)) {
    //     if (idRequested) {
    //         try {
    //             await Category.query().deleteById(idRequested);
    //             await Criteria.query().delete().where('categoryID', idRequested);

    //             return res.status(200).send('Success');
    //         } catch (error) {
    //             console.log(error);
    //             return res.status(400).send('Error deleting category');
    //         }
    //     } else {
    //         return res.status(400).send('Missing information');
    //     }
    // }

    return res.status(401).send('Unauthorized');
});

router.delete('/criteria/:id', async (req, res) => {
    const idRequested = req.params.id;

    // if (can(req.user, Action.DeleteCriteria)) {
    //     if (idRequested) {
    //         try {
    //             await Criteria.query().deleteById(idRequested);

    //             return res.status(200).send('Success');
    //         } catch (error) {
    //             console.log(error);
    //             return res.status(400).send('Error deleting criteria');
    //         }
    //     } else {
    //         return res.status(400).send('Missing information');
    //     }
    // }
    return res.status(401).send('Unauthorized');
});

export default router;
