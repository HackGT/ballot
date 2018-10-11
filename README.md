# Ballot [![Build Status](https://travis-ci.org/HackGT/ballot.svg?branch=master)](https://travis-ci.org/HackGT/ballot)

Stack ranking solution for judge assignment, management, and scoring.

## Getting Started
First, clone the repository and run `npm install` in the project directory. This will install dependencies and build each of the three parts of the project.
In the server folder, this will create a `.env` file where you should fill in any environment variables that should be loaded in.

### Environment Variables

| Envar                           | Description                                                                                         |
|---------------------------------|-----------------------------------------------------------------------------------------------------|
| PORT                            |  REQUIRED: The port that the server is running on                                                   |
| URL                             |  REQUIRED: The URL that the server is running on                                                    |
| SESSION_SECRET                  |  REQUIRED: A private key used for all session tokens                                                |
| NODE_ENV                        |  Used to determine whether the server is running in 'production' or 'development', defaults to dev  |
| SOCKET_AUTH_ENABLED             |  If enabled, will require password to connect to epicenter                                          |
| SOCKET_PASSWORD                 |  If sockets are enabled, the password needed to authenticate.                                       |
| POSTGRES_URL                    |  REQUIRED: the host address of the Postgres server                                                  |
| PGUSERNAME                      |  REQUIRED: the username for the postgres server                                                     |
| PGDATABASE                      |  REQUIRED: the database used for the application in postgres                                        |
| PGPASSWORD                      |  REQUIRED: the password for the postgres user                                                       |
| PGPORT                          |  If we need a port to identify the postgres server, we use this                                     |
| AUTH_ALLOW_GITHUB               |  If enabled, will render Github login on the front end                                              |
| AUTH_GITHUB_ID                  |  The OAuth Client ID for github                                                                     |
| AUTH_GITHUB_SECRET              |  The OAuth Client secret for github                                                                 |
| AUTH_ALLOW_GITHUB               |  If enabled, will render facebook login on the front end                                            |
| AUTH_AUTH_FACEBOOK_ID           |  The OAuth Client ID for facebook                                                                   |
| AUTH_AUTH_FACEBOOK_SECRET       |  The OAuth Client secret for facebook                                                               |
| AUTH_ALLOW_GOOGLE               |  If enabled, will render google login on the front end                                              |
| AUTH_AUTH_GOOGLE_ID             |  The OAuth Client ID for google                                                                     |
| AUTH_AUTH_GOOGLE_SECRET         |  The OAuth Client secret for google                                                                 |
| AUTH_ALLOW_LOCAL                |  If enabled, will render local login on the front end                                               |

### Authentication

*You must have at least one authentication strategy set up in order for the server to run properly.*

For the external oauth services, make sure you set the callback url to `/auth/{service}/callback`.

### Running
Once you have set your environment variables, you will need to go in each of the folders to run each part of the project separately in development.

`cd server` and `npm start` to start the server.
`cd client` and `npm start` to start the client.
`cd epicenter` and `npm start` to start the epicenter.

The two clients will automatically open in development.

The server is required for other parts to work.

The first user that logs in is automatically given superadmin priveleges.

## Deployment

### Manual Deployment
In the project root directory, run `npm run build` to build the application followed by `npm run serve` to serve the application in production.

Type `<SERVER_URL>` to access the judge-facing application.
Type `<SERVER_URL>/epicenter/` to access the epicenter.

### Docker

TODO: Dockerfile

### Heroku

TODO: Heroku link

## Contributing

We greatly appreciate all feature requests and contributions! See [`CONTRIBUTING.md`](https://github.com/hackgt/ballot/blob/master/CONTRIBUTING.md) if you want to get more involved.

## License

Copyright &copy; 2018 HackGT. Released under the MIT license. See [`LICENSE`](LICENSE) for more information.