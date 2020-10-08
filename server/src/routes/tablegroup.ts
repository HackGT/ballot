import { Router } from 'express';

import { can, Action } from '../config/Permissions';
import TableGroupController from '../controllers/TableGroupController';

const router = Router();

router.get('/allTableGroups', async (req, res) => {
  if (can(req.user, Action.ViewTableGroups)) {
    return res.status(200).json(await TableGroupController.getAllTableGroups().catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to manage table groups.');
});

router.post('/update', async (req, res) => {
  if (can(req.user, Action.ManageTableGroups)) {
    return res.status(200).json(await TableGroupController.updateTableGroups(req.body.tableGroups).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to manage table groups.');
});

export default router;
