"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectController_1 = __importDefault(require("../controllers/ProjectController"));
const app_1 = require("../app");
const Ballot_1 = require("../entity/Ballot");
const connectedClients = {};
var Strings;
(function (Strings) {
    Strings["Authenticated"] = "authenticated";
    Strings["Disconnect"] = "disconnect";
    Strings["ProjectQueue"] = "project-queue";
    Strings["ProjectQueued"] = "project-queued";
    Strings["UpdateSession"] = "update-session";
})(Strings || (Strings = {}));
const socketHandler = (client) => {
    console.log(client.id, 'connected');
    const updateRooms = async () => {
        console.log(client.request.user);
        if (client.request.user.logged_in) {
            client.join(Strings.Authenticated);
        }
        else {
            client.leave(Strings.Authenticated);
        }
    };
    updateRooms();
    client.on(Strings.Disconnect, () => {
        updateRooms();
        console.log(client.id, 'disconnected');
        delete connectedClients[client.id];
    });
    client.on(Strings.ProjectQueue, async (data) => {
        updateRooms();
        console.log(data);
        const { eventID, userID, projectID } = data;
        app_1.io.to(Strings.Authenticated).emit(Strings.ProjectQueued, {
            eventID,
            userID,
            projectID,
            done: false,
        });
        const { newBallots, removedBallotIDs } = await ProjectController_1.default.queueProject(projectID, userID);
        console.log('in sockets', {
            newBallots,
            removedBallotIDs,
        });
        app_1.io.to(Strings.Authenticated).emit(Strings.ProjectQueued, {
            eventID,
            userID,
            projectID,
            newBallots: Ballot_1.convertToClient(newBallots),
            removedBallotIDs,
            done: true,
        });
    });
};
exports.default = socketHandler;
