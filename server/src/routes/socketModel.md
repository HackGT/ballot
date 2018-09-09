# Sockets API

## Epicenter-sent Events
### Authentication & Data Store
The client will send an `eventID` and `password` and the server will emit `'all_data'` if `password` is correct. The client should be listening for `'all_data'`.

```typescript
socket.emit('start', data: {
    eventID: string,
    password: string,
});

socket.on('all_data', data: {
    eventID: string,
    status: boolean,
    message: string,
    autoassign: boolean,
    projects: { [projectID: number]: {
        project_id: number,
        devpost_id: string,
        name: string,
        table_number: string,
        expo_number: number,
        sponsor_prizes: string,
        categories: number[],
    }},
    ballots: { [ballotID: number]: {
        ballot_id: number,
        project_id: number,
        criteria_id: number,
        user_id: number,
        judge_priority: number,
        ballot_status: {
            'Pending',
            'Assigned',
            'Submitted',
            'Skipped',
            'Started',
        },
        score?: number,
        score_submitted_at?: Date,
    }},
    categories: { [categoryID: number]: {
        category_id: number,
        name: string,
        is_primary: boolean,
        criteria: number[],
    }},
    criteria: { [criteriaID: number]: {
        criteria_id: number,
        name: string,
        rubric: string,
        min_score: number,
        max_score: number,
        category_id: number,
    }},
    users: {
        user_id: number,
        email: string,
        name: string,
        user_class: {
            'Pending',
            'Judge',
            'Admin',
            'Owner',
        },
    },
    judgeQueues: { [userID: number]: {
        assignedProjectID: number | null,
        queuedProjectID: number | null,
    }},
    judgedProjects: { [userID: number]: number[] },
});
```

### Queue Project
Add a `projectID` to a `judgeID`'s queue. If there is a project in `queuedProjectID`, this will replace it with this project.
```typescript
socket.emit('queue_project', data: {
    eventID: string,
    userID: number,
    projectID: number,
});
```

### Dequeue Project
Remove a `projectID` from a `judgeID`'s queue.
```typescript
socket.emit('dequeue_project', data: {
    eventID: string,
    userID: number,
    projectID: number,
});
```

### Autoassign
Enable or disable autoassign for the application.
```typescript
socket.emit('autoassign', data: {
    eventID: string,
    enabled: boolean,
});
```

## Server Broadcasts
### Queue Project
```typescript
io.to('authorized').emit('queue_project', {
    eventID: string,
    userID: number,
    projectID: number,
});
```

### Dequeue Project
```typescript
io.to('authorized').emit('dequeue_project', {
    eventID: string,
    userID: number,
    projectID: number,
});
```

### Autoassign
```typescript
io.to('authorized').emit('autoassign', {
    eventID: string,
    enabled: boolean,
})
```

### Next Project
`'next_project'` is emitted when a judge clicks on the next project button after the judge finishes his previous project. Emitted after a judge is assigned a new project, but not yet started.
```typescript
io.to('authorized').emit('next_project', {
    userID: number,
    projectID: number,
});
```

### Start Project
`'start_project'` is emitted when a judge presses the button to start the project he was just assigned in `'next_project'`. Emitted only after the ballot status is changed to `started`.
```typescript
io.to('authorized').emit('start_project', {
    userID: number,
    projectID: number,
});
```

### Skip Project
`'skip_project'` is emitted when a judge skips a project. Project is removed from `judgeID`'s `activeProjectID`. `activeProjectID` will be set when `next_project` is emitted.
```typescript
io.to('authorized').emit('skip_project', {
    userID: number,
    projectID: number,
});
```

### Score Project
`'score_project'` is emitted when a judge finishes judging a project and submits scores. Project is removed from `judgeID`'s `activeProjectID`. An array of ballots will be sent to allow for updates of state.
```typescript
io.to('authorized').emit('score_project', {
    userID: number,
    projectID: number,
    ballots: [{
        ballot_id: number,
        project_id: number,
        criteria_id: number,
        user_id: number,
        judge_priority: number,
        ballot_status: {
            'Pending',
            'Assigned',
            'Submitted',
            'Skipped',
            'Started',
        },
        score?: number,
        score_submitted_at?: Date,
    }],
});
```

### Add User
`'add_user'` is emitted when a new user is added or changed.

```typescript
io.to('authorized').emit('add_user', {
    user_id: number,
    email: string,
    name: string,
    user_class: {
        'Pending',
        'Judge',
        'Admin',
        'Owner',
    },
});
```
