import { Router, Request, Response } from 'express';
import {
    ProjectService,
    // ProjectSerializer
} from '../controllers/ProjectService';

const multiparty = require('multiparty');
const fs = require('fs');

const form = new multiparty.Form();

const router = Router();

interface CSVPATH {
    path: string;
}

interface FileInfo {
    [index: string]: CSVPATH[];
}

// const fakecsv: ProjectSerializer = [{
// 	devpost_link: 'https://devpost.com/foo',
//     project_name: 'NICE',
//     location: 38,
//     categories: ["Hardware", "Fun"],
// }, {
// 	devpost_link: 'https://devpost.com/bar',
//     project_name: 'LOLCOPTER',
//     location: 102,
//     categories: ["Hardware", "Games"]
// }, {
// 	devpost_link: 'https://devpost.com/baz',
//     project_name: 'BLOCKCHAIN',
//     location: 104,
//     categories: ["Games"],
// }]

router.post('/', (req: Request, res: Response) => {
    form.parse(req, (err: any, fields: any, files: FileInfo) => {
       if (!files) { return; }
       Object.keys(files).forEach((key) => {
            const values: CSVPATH[]  = files[key];
            values.forEach((value) => {
                fs.readFile(value.path, (err2: any, data: Buffer) => {
                    ProjectService.serializeProjects(data.toString());
                });
            });
        });
    });
    res.json({
        status: 'ok',
    });
});

export default router;
