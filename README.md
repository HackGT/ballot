# Ballot

Stack ranking solution for judge assignment, management, and scoring.

## Getting Started

First, clone the repository and run `npm install`. This will create a `.env` file where you should fill in any environment variables that should be loaded in.

| Envar                           | Description                                                                                         |
|---------------------------------|-----------------------------------------------------------------------------------------------------|
| Port                            |  REQUIRED: The port that the server is running on                                                   |
| URL                             |  REQUIRED: The URL that the server is running on                                                    |
| SESSION_SECRET                  |  REQUIRED: A private key used for all session tokens                                                |
| NODE_ENV                        |  Used to determine whether the server is running in 'production' or 'development', defaults to dev  |
| PGHOST                          |  REQUIRED: the host address of the Postgres server                                                  |
| PGUSER                          |  REQUIRED: the username for the postgres server                                                     |
| PGDATABASE                      |  REQUIRED: the database used for the application in postgres                                        |
| PGPASSWORD                      |  REQUIRED: the password for the postgres user                                                       |
| PGPORT                          |  If we need a port to identify the postgres server, we use this                                     |
| AUTH_GITHUB_ID                  |  For authentication, necessary for Github OAuth                                                     |
| AUTH_GITHUB_SECRET              |  For authentication, necessary for Github OAuth                                                     |
| AUTH_GITHUB_CALLBACK_URL        |  For authentication, necessary for Github OAuth                                                     |
| AUTH_AUTH_FACEBOOK_ID           |  For authentication, necessary for Facebook OAuth                                                   |
| AUTH_AUTH_FACEBOOK_SECRET       |  For authentication, necessary for Facebook OAuth                                                   |
| AUTH_AUTH_FACEBOOK_CALLBACK_URL |  For authentication, necessary for Facebook OAuth                                                   |
| AUTH_AUTH_GOOGLE_ID             |  For authentication, necessary for Google OAuth                                                     |
| AUTH_AUTH_GOOGLE_SECRET         |  For authentication, necessary for Google OAuth                                                     |
| AUTH_AUTH_GOOGLE_CALLBACK_URL   |  For authentication, necessary for Google OAuth                                                     |
| AUTH_ALLOW_LOCAL                |  For authentication, necessary for Local Authentication                                             |

*You must have at least one authentication strategy set up in order for the server to run properly.*

Once you have set your environment variables, you can build and run the server in development by running `npm start`.

Visit `http://localhost:3000`, and you are good to go!

## Deployment

### Manual Deployment

Run `npm run build` to build the server followed by `npm run serve` to serve the application in production.

### Docker

TODO: Dockerfile

### Heroku

TODO: Heroku link

## Contributing

We greatly appreciate all feature requests and contributions! See [`CONTRIBUTING.md`](https://github.com/hackgt/ballot/blob/master/CONTRIBUTING.md) if you want to get more involved.

## License

Copyright &copy; 2018 HackGT. Released under the MIT license. See [`LICENSE`](LICENSE) for more information.