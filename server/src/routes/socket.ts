import { User } from '../entity/User';
import Authentication from '../config/Authentication';
import BallotController from '../controllers/BallotController';
import ProjectController from '../controllers/ProjectController';
import { io } from '../app';
import { convertToClient } from '../entity/Ballot';

const connectedClients: { [socketID: string]: User | undefined } = {};

enum Strings {
  Authenticated = 'authenticated',
  Disconnect = 'disconnect',
  ProjectQueue = 'project-queue',
  ProjectQueued = 'project-queued',
  UpdateSession = 'update-session',
}

const socketHandler = (client: SocketIO.Socket) => {
  console.log(client.id, 'connected');
  const updateRooms = async () => {
    console.log(client.request.user);
    if (client.request.user.logged_in) {
      client.join(Strings.Authenticated);
    } else {
      client.leave(Strings.Authenticated);
    }
  };

  updateRooms();

  client.on(Strings.Disconnect, () => {
    updateRooms();
    console.log(client.id, 'disconnected');
    delete connectedClients[client.id];
  });

  client.on(Strings.ProjectQueue, async (data: {
    eventID: string;
    userID: number;
    projectID: number;
  }) => {
    updateRooms();
    console.log(data);
    const { eventID, userID, projectID } = data;
    io.to(Strings.Authenticated).emit(Strings.ProjectQueued, {
      eventID,
      userID,
      projectID,
      done: false,
    });

    const {
      newBallots,
      removedBallotIDs
    } = await ProjectController.queueProject(projectID, userID);
    console.log('in sockets', {
      newBallots,
      removedBallotIDs,
    });

    io.to(Strings.Authenticated).emit(Strings.ProjectQueued, {
      eventID,
      userID,
      projectID,
      newBallots: convertToClient(newBallots),
      removedBallotIDs,
      done: true,
    });
  });
};

export default socketHandler;
