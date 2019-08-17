import { Router } from 'express';

import { can, Action } from '../config/Permissions';
import TableGroupController from '../controllers/TableGroupController';

const router = Router();

router.get('/allTableGroups', async (req, res) => {
  if (can(req.user, Action.ManageTableGroups)) {
    return res.status(200).json(await TableGroupController.getAllTableGroups());
  }

  return res.status(401).send('Not enough permissions to manage table groups.');
});

router.post('/update', async (req, res) => {
  if (can(req.user, Action.ManageTableGroups)) {
    return res.status(200).json(await TableGroupController.updateTableGroups(req.body.tableGroups));
  }

  return res.status(401).send('Not enough permissions to manage table groups.');
});

export default router;
