import { Router } from 'express';
import passport from 'passport';
import * as bodyParser from 'body-parser';

const postParser = bodyParser.urlencoded({
    extended: false,
});

const router: Router = Router();

router.get('/user_data', (req, res) => {
    if (req.user === undefined) {
        return res.status(200).json({});
    } else {
        return res.status(200).json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            company: req.user.company,
            tags: req.user.tags,
        });
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    return res.status(200).json({
        user_id: null,
    });
});

router.post('/login', postParser, (req, res, next) => {
    passport.authenticate('local', (error, user) => {
        if (user) {
            req.logIn(user, () => {
                return res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    company: user.company,
                    tags: user.tags,
                });
            });
        } else {
            return res.json({
                id: null,
            });
        }

        return null;
    })(req, res, next);
});

router.post('/signup', postParser, (req, res, next) => {
    passport.authenticate('local', (error, user) => {
        if (user) {
            return res.status(200).json({
                status: true,
            });
        } else {
            return res.status(200).json({
                status: false,
            });
        }
    })(req, res, next);
});

export default router;
