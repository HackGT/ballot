import { dataStore, DataStore } from '../store/DataStore';

const socketHandler = (socket: SocketIO.Socket) => {
    console.log(socket.id, 'connected');
    socket.emit('all_data', {
        projects: dataStore.projects,
        ballots: dataStore.ballots,
        categories: dataStore.categories,
        criteria: dataStore.criteria,
        users: dataStore.users,
    });

    socket.on('ping', () => {
        socket.emit('Pong!');
    });

    socket.on('autoassign', (data: {
        enabled: boolean,
    }) => {
        // Prevent all other clients from enabling autoassign.
        console.log(data);
    });

    socket.on('queue_project', (data: {
        projectID: number,
        userID: number,
    }) => {
        // Queue a project for a specific judge.
        // Broadcast event to queue this project.
        console.log(data);
    });

    socket.on('dequeue_project', (data: {
        projectID: number,
        userID: number,
    }) => {
        // Dequeue a project for a specific judge.
        // Broadcast event to dequeue this project.
        console.log(data);
    });

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
    });
}

export default socketHandler;
