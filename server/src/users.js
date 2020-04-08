const users = {};

function getLoggedInUsers() {
    return Object.values(
        users
    ).map(({id, userName}) => ({id, userName}));
}

function userExists(clientInstanceId) {
    return !!users[clientInstanceId]

}

function addUser(ws, clientInstanceId, userName) {
    users[clientInstanceId] = ws;
    users[clientInstanceId].userName = userName;
    users[clientInstanceId].id = clientInstanceId;
}

function deleteUser(clientInstanceId) {
    delete users[clientInstanceId]
}

module.exports = {
    getLoggedInUsers,
    userExists,
    addUser,
    deleteUser
}
