import { Router } from 'express';
import * as passport from 'passport';
import { Environment } from '../config/Environment';
import * as bodyParser from 'body-parser';

const postParser = bodyParser.urlencoded({
    extended: false,
});

const router: Router = Router();

const failureRedirect = '/';
const successRedirect = '/';

router.get('/user_data', (req, res) => {
    if (req.user === undefined) {
        res.json({});
    } else {
        res.json({
            user_id: req.user.user_id,
            email: req.user.email,
            name: req.user.name,
            user_class: req.user.user_class,
        });
    }
});

router.get('/user_data/class', (req, res) => {
    if (req.user === undefined) {
        res.json({
            a: undefined,
        });
    } else {
        res.json({
            a: req.user.user_class,
        });
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

if (Environment.getFacebookAuth()) {
    router.get('/facebook/login',
        passport.authenticate('facebook', { scope: ['email'] }));

    router.get('/facebook/callback', passport.authenticate('facebook', {
        failureRedirect, successRedirect,
    }));
}

if (Environment.getGithubAuth()) {
    router.get('/github/login',
        passport.authenticate('github', { scope: ['user:email'] }));

    router.get('/github/callback', passport.authenticate('github', {
        failureRedirect, successRedirect,
    }));
}

if (Environment.getGoogleAuth()) {
    router.get('/google/login',
        passport.authenticate('google', { scope: ['email', 'profile'] }));

    router.get('/google/callback', passport.authenticate('google', {
        failureRedirect, successRedirect,
    }));
}

if (Environment.allowLocalAuth()) {
    router.post('/login',
        postParser,
        (req, res, next) => {
            passport.authenticate('local', (error, user, info) => {
                console.log(user);
                if (user) {
                    req.logIn(user, (err) => {
                        return res.json({
                            name: user.name,
                            email: user.email,
                            class: user.user_class,
                            user_id: user.user_id,
                        });
                    });
                }

                return res.json({ a: null });
            })(req, res, next);
        }
    );

    router.post('/signup',
        postParser,
        (req, res, next) => {
            passport.authenticate('local', (error, user, info) => {
                if (!user) {
                    return res.json({
                        status: true,
                        message: 'Success',
                    });
                } else {
                    return res.json({
                        status: false,
                        message: 'User already exists',
                    });
                }
            })(req, res, next);
        }
    );
}

export default router;


