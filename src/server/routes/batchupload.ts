import { Router, Request, Response } from 'express';
import { ProjectService, ProjectSerializer } from '../controllers/ProjectService';

const router = Router();

const fakecsv: ProjectSerializer = [{
	devpost_link: 'https://devpost.com/foo',
    project_name: 'NICE',
    location: 38,
    categories: ["Hardware", "Fun"],
}, {
	devpost_link: 'https://devpost.com/bar',
    project_name: 'LOLCOPTER',
    location: 102,
    categories: ["Hardware", "Games"]
}, {
	devpost_link: 'https://devpost.com/baz',
    project_name: 'BLOCKCHAIN',
    location: 104,
    categories: ["Games"],
}]

router.post('/', (req: Request, res: Response) => {
	ProjectService.batchUploadProjects(fakecsv)
    res.json({
        status: 'ok',
    });
});

export default router;
