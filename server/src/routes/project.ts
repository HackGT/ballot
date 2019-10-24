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

router.post('/nextProject', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.getNextProject(req.body.userID));
  }

  return res.status(401).send('Not enough permissions to get next project');
});

router.post('/startProject', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.startProject(req.body.userID, req.body.projectID));
  }

  return res.status(401).send('Not enough permissions to start project.');
});

router.post('/scoreProject', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.scoreProject(req.body.ballots));
  }

  return res.status(401).send('Not enough permissions to score project');
});

router.post('/skip', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.skipProject(req.body.userID, req.body.proejctID));
  }

  return res.status(401).send('Not enough permissions to skip project');
});

router.post('/busy', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.projectBusy(req.body.userID, req.body.proejctID));
  }

  return res.status(401).send('Not enough permissions to mark project as busy');
});

router.post('/missing', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.projectMissing(req.body.userID, req.body.projectID));
  }

  return res.status(401).send('Not enough permissions to mark project as missing');
});

export default router;
