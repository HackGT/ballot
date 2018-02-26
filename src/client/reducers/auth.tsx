const auth = (state: any, action: any) => {
    if (state === undefined) {
        return { role: null };
    }

    switch (action.type) {
        case 'UPDATE_CLASS':
            return { role: action.role };
        default:
            return state;
    }
};

export default auth;