import { Router, Request, Response } from 'express';
import * as path from 'path';
import { BallotService } from '../controllers/BallotService';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    BallotService.getRanking();
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

export default router;
