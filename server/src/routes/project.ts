import { Router } from 'express';
import { can, Action } from '../config/Permissions';
import ProjectController from '../controllers/ProjectController';

const router = Router();

router.get('/allProjects', async (req, res) => {
  if (can(req.user, Action.ViewProjects)) {
    return res.status(200).json(await ProjectController.getAllProjects());
  }

  return res.status(401).send('Not enough permissions to view projects.');
});

router.post('/upload', async (req, res) => {
  if (can(req.user, Action.BatchUploadProjects)) {
    return res.status(200).json(await ProjectController.batchUploadProjects(req.body.projects));
  }

  return res.status(401).send('Not enough permissions to upload projects.');
});

export default router;
