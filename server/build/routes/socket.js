"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectController_1 = __importDefault(require("../controllers/ProjectController"));
const app_1 = require("../app");
const Ballot_1 = require("../entity/Ballot");
const Permissions_1 = require("../config/Permissions");
const connectedClients = {};
var SocketStrings;
(function (SocketStrings) {
    SocketStrings["Authenticated"] = "authenticated";
    SocketStrings["Disconnect"] = "disconnect";
    SocketStrings["ProjectQueue"] = "project-queue";
    SocketStrings["ProjectQueued"] = "project-queued";
    SocketStrings["ProjectGot"] = "project-got";
    SocketStrings["ProjectScore"] = "project-score";
    SocketStrings["ProjectSkip"] = "project-skip";
    SocketStrings["ProjectBusy"] = "project-busy";
    SocketStrings["ProjectMissing"] = "project-missing";
    SocketStrings["ProjectStart"] = "project-start";
    SocketStrings["UpdateSession"] = "update-session";
})(SocketStrings = exports.SocketStrings || (exports.SocketStrings = {}));
const socketHandler = (client) => {
    const updateRooms = async () => {
        if (client.request.user.logged_in && Permissions_1.can(client.request.user, Permissions_1.Action.QueueProject)) {
            client.join(SocketStrings.Authenticated);
            return true;
        }
        client.leave(SocketStrings.Authenticated);
        return false;
    };
    updateRooms();
    client.on(SocketStrings.Disconnect, () => {
        updateRooms();
        delete connectedClients[client.id];
    });
    client.on(SocketStrings.ProjectQueue, async (data) => {
        if (updateRooms()) {
            const { eventID, userID, projectID } = data;
            client.broadcast.to(SocketStrings.Authenticated).emit(SocketStrings.ProjectQueue, {
                eventID,
                userID,
                projectID,
            });
            const { newBallots, removedBallotIDs, } = await ProjectController_1.default.queueProject(projectID, userID);
            app_1.io.to(SocketStrings.Authenticated).emit(SocketStrings.ProjectQueued, {
                eventID,
                userID,
                projectID,
                newBallots: Ballot_1.convertToClient(newBallots),
                removedBallotIDs,
                done: true,
            });
        }
    });
};
exports.default = socketHandler;
