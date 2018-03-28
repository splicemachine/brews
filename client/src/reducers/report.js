const report = (state = [], action) => {
    switch (action.type) {
        case "RECEIVED_REPORT":
            console.log("Got this action", action);
            return [
                ...action.table
            ];
        // case "TOGGLE_TODO":
        //     return state.map(todo =>
        //         (todo.id === action.id)
        //             ? {...todo, completed: !todo.completed}
        //             : todo
        //     );
        default:
            return state
    }
};

export default report
