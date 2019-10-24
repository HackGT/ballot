"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http = __importStar(require("http"));
const passport_1 = __importDefault(require("passport"));
const socket_io_1 = __importDefault(require("socket.io"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const passport_socketio_1 = __importDefault(require("passport.socketio"));
const pg_1 = __importDefault(require("pg"));
require("reflect-metadata");
const Environment_1 = __importDefault(require("./config/Environment"));
const Database_1 = __importDefault(require("./config/Database"));
const Logger_1 = __importDefault(require("./util/Logger"));
const auth_1 = __importDefault(require("./routes/auth"));
const api_1 = __importDefault(require("./routes/api"));
const Authentication_1 = __importDefault(require("./config/Authentication"));
const socket_1 = __importDefault(require("./routes/socket"));
const app = express_1.default();
const server = http.createServer(app);
exports.io = socket_io_1.default(server);
async function start() {
    try {
        await Environment_1.default.verifyEnvironment();
    }
    catch (error) {
        Logger_1.default.error('Server startup canceled due to an error with the environment.');
        throw new Error(error);
    }
    Logger_1.default.success('Environment verified');
    try {
        Logger_1.default.info('Setting up database');
        await Database_1.default.connect();
    }
    catch (error) {
        Logger_1.default.error('Server startup canceled due to an error with the database.');
        throw new Error(error);
    }
    Logger_1.default.success('Database Initialized');
    const pgSessionStore = connect_pg_simple_1.default(express_session_1.default);
    const pgPool = new pg_1.default.Pool({
        max: 200,
        idleTimeoutMillis: 30000,
        ...Database_1.default.getConnectionObject(),
    });
    const sessionMiddleware = express_session_1.default({
        store: new pgSessionStore({
            pool: pgPool,
        }),
        secret: Environment_1.default.getSessionSecret(),
        resave: true,
        saveUninitialized: true,
    });
    app.use(sessionMiddleware).use(cookie_parser_1.default());
    try {
        Logger_1.default.info('Setting up Passport');
        Authentication_1.default.setupStrategies();
        for (const strategy of Authentication_1.default.getStrategies()) {
            passport_1.default.use(strategy);
        }
        passport_1.default.serializeUser(Authentication_1.default.serialize);
        passport_1.default.deserializeUser(Authentication_1.default.deserialize);
        app.use(passport_1.default.initialize());
        app.use(passport_1.default.session());
    }
    catch (error) {
        Logger_1.default.error('Server startup canceled due to an error with Passport');
        throw new Error(error);
    }
    exports.io.on('connection', socket_1.default);
    exports.io.use((socket, next) => {
        console.log('wowowowow');
        passport_socketio_1.default.authorize({
            cookieParser: require('cookie-parser'),
            secret: Environment_1.default.getSessionSecret(),
            store: new pgSessionStore({
                conObject: Database_1.default.getConnectionObject(),
            }),
        })(socket, next);
    });
    app.use(express_1.default.json());
    app.use('/auth', auth_1.default);
    app.use('/api', api_1.default);
    server.listen(Environment_1.default.getPort());
    Logger_1.default.success('Server started');
}
start();
