import { Router, Request, Response } from 'express';
import * as path from 'path';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname + '/../public/client/index.html'));
});

router.get('/dashboard', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname + '/../public/dashboard/index.html'));
});

export default router;
