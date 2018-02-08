import { Router } from 'express';
import * as passport from 'passport';
import { Environment } from '../config/Environment';

const router: Router = Router();

const failureRedirect = '/';
const successRedirect = '/';



if (Environment.getFacebookAuth()) {
    router.get('/facebook/login', passport.authenticate('facebook', { scope: ['email'] }));

    router.get('/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: failureRedirect, successRedirect: successRedirect
    }));
}

if (Environment.getGithubAuth()) {
    router.get('/github/login', passport.authenticate('github', { scope: ['user:email'] }));

    router.get('/github/callback', passport.authenticate('facebook', {
        failureRedirect: failureRedirect, successRedirect: successRedirect
    }));
}

if (Environment.getGoogleAuth()) {
    router.get('/google/login', passport.authenticate('google', { scope: ['email', 'profile'] }));

    router.get('/google/callback', passport.authenticate('facebook', {
        failureRedirect: failureRedirect, successRedirect: successRedirect
    }));
}

if (Environment.allowLocalAuth()) {
    router.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }));

    router.post('/signup', passport.authenticate('local', {failureRedirect: '/login'}), (req, res)=> {
        req.logout();
        res.redirect('/login')
    });
}

export default router;


