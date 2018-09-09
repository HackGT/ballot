import { dataStore } from '../store/DataStore';
import { io } from '../app';

const connectedClients: { [id: string]: {
    id: string,
    authenticated: boolean,
}} = {};

const socketHandler = (socket: SocketIO.Socket) => {
    console.log(socket.id, 'connected');
    connectedClients[socket.id] = {
        id: socket.id,
        authenticated: !process.env.SOCKET_AUTH_ENABLED,
    };
    console.log(connectedClients);

    if (connectedClients[socket.id].authenticated) {
        socket.join('authenticated');
    }

    socket.on('start', (data: {
        eventID: string,
        password: string,
    }) => {
        logReceived(data);
        if (data.password && data.eventID) {
            if (process.env.SOCKET_PASSWORD === data.password || !process.env.SOCKET_AUTH_ENABLED) {
                connectedClients[socket.id].authenticated = true;
                socket.join('authenticated');
                socket.emit('all_data', {
                    eventID: data.eventID,
                    status: true,
                    message: 'Latest state sent',
                    autoassign: dataStore.autoassignEnabled,
                    projects: dataStore.projects, // Only category IDs
                    ballots: dataStore.ballots,
                    categories: dataStore.categories, // Only criteria IDs
                    criteria: dataStore.criteria,
                    users: dataStore.users,
                    judgeQueues: dataStore.judgeQueues,
                    judgedProjects: dataStore.judgedProjects,
                });
            }

        }
    });

    socket.on('autoassign', (data: {
        eventID: string,
        enabled: boolean,
    }) => {
        logReceived(data);
        // Prevent all other clients from enabling autoassign.
        if (data.eventID && (data.enabled || !data.enabled)) {
            if (connectedClients[socket.id].authenticated) {
                io.in('authenticated').emit('autoassign', {
                    eventID: data.eventID,
                    enabled: data.enabled,
                });
            }
        }
    });

    socket.on('queue_project', async (data: {
        eventID: string,
        userID: number,
        projectID: number,
    }) => {
        logReceived(data);

        if (data.projectID && data.userID && data.eventID) {
            if (connectedClients[socket.id].authenticated) {
                const queueResult = await dataStore.queueProject(data.userID, data.projectID);
                if (queueResult.status) {
                    io.in('authenticated').emit('queue_project', {
                        eventID: data.eventID,
                        userID: data.userID,
                        projectID: data.projectID,
                    });
                }
            }
        }

        // Queue a project for a specific judge.
        // Broadcast event to queue this project.
    });

    socket.on('dequeue_project', async (data: {
        eventID: string,
        projectID: number,
        userID: number,
    }) => {
        if (data.projectID && data.userID && data.eventID) {
            if (connectedClients[socket.id].authenticated) {
                const dequeueResult = await dataStore.dequeueProject(data.userID, data.projectID);
                if (dequeueResult.status) {
                    io.in('authenticated').emit('dequeue_project', {
                        eventID: data.eventID,
                    });
                }
            }
        }
    });

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        delete connectedClients[socket.id];
        console.log(connectedClients);
    });
};

const logReceived = (value: any) => {
    console.log('Received: ', value);
};

export default socketHandler;
