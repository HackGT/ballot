import * as passport from 'passport';
import { Environment } from './Environment';
import { Logger } from '../util/Logger';

const logger = Logger('config/auth');

// strategies
import { Strategy as GitHubStrategy, Profile as GithubProfile } from 'passport-github2';
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from "passport-facebook";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy, Profile } from 'passport';

// Github
const githubConfig = Environment.getGithubAuth();
addStrategy('Github', 
    githubConfig, 
    GitHubStrategy, 
    (accessToken: string, refreshToken: string, profile: GithubProfile, done: (error: any, user?: any) => void) => {
    
});

// Google
const googleConfig = Environment.getGoogleAuth();
addStrategy('Google', 
    googleConfig,
    GoogleStrategy,
    (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
    
});

// Facebook
const facebookConfig = Environment.getFacebookAuth();
addStrategy('Facebook',
    facebookConfig,
    FacebookStrategy,
    (accessToken: string, refreshToken: string, profile: FacebookProfile, done: (error: any, user?: any) => void) => {
    
});

// Local
if (Environment.allowLocalAuth()) {
    logger.info('Local envars found, enabling Local Authentication');
} else {
    logger.warn('No Local Authentication envars found.');
}

function addStrategy(name: string, strategy: any, config: any, callback: any) {
    if (githubConfig) {
        logger.info(`${name} envars found, enabling ${name} Authentication`);
        passport.use(
            new strategy(config, callback)
        );
    } else {
        logger.warn(`No ${name} Authentication envars found. Skipping.`);
    }
}