import { User } from '../entity/User';
import Authentication from '../config/Authentication';
import BallotController from '../controllers/BallotController';
import ProjectController from '../controllers/ProjectController';
import { io } from '../app';
import { convertToClient } from '../entity/Ballot';
import { can, Action } from '../config/Permissions';

const connectedClients: { [socketID: string]: User | undefined } = {};

export enum SocketStrings {
  Authenticated = 'authenticated',
  Disconnect = 'disconnect',
  ProjectQueue = 'project-queue',
  ProjectQueued = 'project-queued',
  ProjectGot = 'project-got',
  ProjectScore = 'project-score',
  ProjectSkip = 'project-skip',
  ProjectBusy = 'project-busy',
  ProjectMissing = 'project-missing',
  ProjectStart = 'project-start',
  UpdateSession = 'update-session',
}

const socketHandler = (client: SocketIO.Socket) => {
  console.log(client.id, 'connected');
  const updateRooms = async () => {
    console.log('updaterooms', client.request.user);
    console.log('updateroomscan', can(client.request.user, Action.QueueProject));
    if (client.request.user.logged_in && can(client.request.user, Action.QueueProject)) {
      client.join(SocketStrings.Authenticated);
      return true;
    }

    client.leave(SocketStrings.Authenticated);
    return false;
  };

  updateRooms();

  client.on(SocketStrings.Disconnect, () => {
    updateRooms();
    console.log(client.id, 'disconnected');
    delete connectedClients[client.id];
  });

  client.on(SocketStrings.ProjectQueue, async (data: {
    eventID: string;
    userID: number;
    projectID: number;
  }) => {
    console.log(data);
    console.log(client.request.user);
    if (updateRooms()) {
      const { eventID, userID, projectID } = data;
      client.broadcast.to(SocketStrings.Authenticated).emit(SocketStrings.ProjectQueue, {
        eventID,
        userID,
        projectID,
      });

      const {
        newBallots,
        removedBallotIDs
      } = await ProjectController.queueProject(projectID, userID);
      console.log('in sockets', {
        newBallots,
        removedBallotIDs,
      });

      io.to(SocketStrings.Authenticated).emit(SocketStrings.ProjectQueued, {
        eventID,
        userID,
        projectID,
        newBallots: convertToClient(newBallots),
        removedBallotIDs,
        done: true,
      });
    }
  });
};

export default socketHandler;
