import { Router } from 'express';

import UserController from '../controllers/UserController';
import { can, Action } from '../config/Permissions';

const router = Router();

router.get('/allUsers', async (req, res) => {
  // console.log(req.user);
  if (can(req.user, Action.ViewUsers)) {
    return res.status(200).json(await UserController.getAllUsersSafe().catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to view users.');
});

router.post('/update', async (req, res) => {
  // console.log(req.body);
  if (can(req.user, Action.EditUser)) {
    return res.status(200).json(await UserController.updateUser(req.body.user).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to edit or create users.');
});

export default router;
