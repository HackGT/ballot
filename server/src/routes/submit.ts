import { Router } from 'express';
import { can, Action } from '../config/Permissions';
import SubmitController from '../controllers/SubmitController';

const router = Router();

router.get('/import/:categories/:accepted', async (req, res) => {
  if (can(req.user, Action.ImportProjects)) {
    return res.status(200).json(await SubmitController.importProjects(req.params.categories, req.params.accepted)
      .catch(error => {
        console.log((error as Error).message);
        res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to import projects.');
});

router.get('/accept', async (req, res) => {
  if (can(req.user, Action.AcceptProjects)) {
    return res.status(200).json(await SubmitController.sendAcceptedProjectsToSubmit().catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to accept projects.');
});

export default router;
