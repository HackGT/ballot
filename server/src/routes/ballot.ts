import { Router } from 'express';
import { can, Action } from '../config/Permissions';
import BallotController from '../controllers/BallotController';

const router = Router();

router.get('/allBallots', async (req, res) => {
  if (can(req.user, Action.ViewBallot)) {
    return res.status(200).json(await BallotController.getAllBallots().catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }
  return res.status(401).send('Not enough permissions to view ballots.');
});

export default router;
