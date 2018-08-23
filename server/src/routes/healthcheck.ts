import { Router, Request, Response } from 'express';

const pkg = require('./../../package.json');

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        name: pkg.name,
        version: pkg.version,
    });
});

export default router;
