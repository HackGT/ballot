import { Router, Request, Response } from 'express';
import * as path from 'path';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

export default router;
