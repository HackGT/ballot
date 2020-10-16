import { Router } from 'express';

import ballot from '../routes/ballot';
import category from '../routes/category';
import project from '../routes/project';
import tablegroup from '../routes/tablegroup';
import user from '../routes/user';
import submit from '../routes/submit';

const router: Router = Router();

router.use('/ballots', ballot);
router.use('/categories', category);
router.use('/projects', project);
router.use('/tableGroups', tablegroup);
router.use('/users', user);
router.use('/submit', submit);

export default router;
