# Ballot
HackGT's judging system!

## Getting Started
1. Run `npm install` to install dependencies

**Note: Ensure you start the server before the client**

### Server
1. Start Postgres server and ensure ballot database exists
2. `cd server`
3. Copy `.env.example` to `.env` and fill in env vars
4. `npm start` to build and run server
5. Visit `localhost:3000` to see server

### Client
1. `cd client`
2. `npm start` to start frontend
3. When prompted with `Would you like to run the app on another port instead? (Y/n)`, type `y`
4. Visit `localhost:3001` to view React client
