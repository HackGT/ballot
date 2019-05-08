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
const socket_io_1 = __importDefault(require("socket.io"));
const http = __importStar(require("http"));
const passport_1 = __importDefault(require("passport"));
const Environment_1 = __importDefault(require("./config/Environment"));
const Database_1 = __importDefault(require("./config/Database"));
const Authentication_1 = __importDefault(require("./config/Authentication"));
const Logger_1 = __importDefault(require("./util/Logger"));
const auth_1 = __importDefault(require("./routes/auth"));
const api_1 = __importDefault(require("./routes/api"));
const app = express_1.default();
const server = http.createServer(app);
const io = socket_io_1.default(server);
async function start() {
    try {
        await Environment_1.default.verifyEnvironment();
    }
    catch (_a) {
        Logger_1.default.error('Server startup canceled due to an error with the environment.');
    }
    finally {
        Logger_1.default.success('Environment verified');
    }
    try {
        Logger_1.default.info('Setting up database');
        await Database_1.default.connect();
        Logger_1.default.info('Creating tables');
        await Database_1.default.createSchema();
    }
    catch (_b) {
        Logger_1.default.error('Server startup canceled due to an error with the database.');
    }
    finally {
        Logger_1.default.success('Database Initialized');
    }
    app.use(express_session_1.default({
        secret: Environment_1.default.getSession(),
        resave: true,
        saveUninitialized: true,
    }));
    Authentication_1.default.setupStrategies();
    for (const strategy of Authentication_1.default.getStrategies()) {
        passport_1.default.use(strategy);
    }
    passport_1.default.serializeUser(Authentication_1.default.serialize);
    passport_1.default.deserializeUser(Authentication_1.default.deserialize);
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(express_1.default.json());
    app.use('/auth', auth_1.default);
    app.use('/api', api_1.default);
    server.listen(Environment_1.default.getPort());
    Logger_1.default.success('Server started');
}
start();
