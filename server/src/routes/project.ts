import { Router } from 'express';
import { can, Action } from '../config/Permissions';
import ProjectController from '../controllers/ProjectController';

const router = Router();

router.get('/allProjects', async (req, res) => {
  if (can(req.user, Action.ViewProjects)) {
    return res.status(200).json(await ProjectController.getAllProjects().catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to view projects.');
});

router.post('/upload', async (req, res) => {
  if (can(req.user, Action.BatchUploadProjects)) {
    return res.status(200).json(await ProjectController.batchUploadProjects(req.body.projects).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to upload projects.');
});

router.post('/nextProject', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.getNextProject(req.body.userID).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to get next project');
});

router.post('/startProject', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.startProject(req.body.userID, req.body.projectID).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to start project.');
});

router.post('/scoreProject', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.scoreProject(req.body.ballots).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to score project');
});

router.post('/skip', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.skipProject(req.body.userID, req.body.projectID).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to skip project');
});

router.post('/busy', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.projectBusy(req.body.userID, req.body.projectID).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to mark project as busy');
});

router.post('/missing', async (req, res) => {
  if (can(req.user, Action.ScoreBallot)) {
    return res.status(200).json(await ProjectController.projectMissing(req.body.userID, req.body.projectID).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to mark project as missing');
});

router.post('/changeProjectRound', async (req, res) => {
  if (true) {
    return res.status(200).json(await ProjectController.changeProjectRound(req.body.project, req.body.newRoundNumber).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));

  }

  return res.status(401).send('Not enough permissions to update project round');
})

router.post('/changeProjectRounds', async (req, res) => {
  if (true) {
    return res.status(200).json(await ProjectController.changeProjectRounds(req.body.projects, req.body.newRoundNumber).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));

  }

  return res.status(401).send('Not enough permissions to update project round');
})

router.get('/export-sponsor/:sponsor', async (req, res) => {
  if (can(req.user, Action.BatchUploadProjects)) {
    res.attachment("data.csv");
    return res.status(200).send(await ProjectController.exportSponsorData(req.params.sponsor).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to export csv');
});

export default router;
