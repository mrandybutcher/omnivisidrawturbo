const EventEmitter = require('events')

function getLoggedInUsers(users) {
    return Object.values(
        users
    ).map(({id, userName}) => ({id, userName}));
}

class UserStore extends EventEmitter {
    constructor() {
        super();
        this.users = {};
    }
    addUser(ws, clientInstanceId, userName) {
        this.users[clientInstanceId] = ws;
        this.users[clientInstanceId].userName = userName;
        this.users[clientInstanceId].id = clientInstanceId;
        this.emit("usersUpdated", getLoggedInUsers(this.users))
    }
    userExists(clientInstanceId) {
        return !!this.users[clientInstanceId]
    }
    deleteUser(clientInstanceId) {
        delete this.users[clientInstanceId]
        this.emit("usersUpdated", getLoggedInUsers(this.users))
    }
    updateUserName(clientInstanceId, userName) {
        this.users[clientInstanceId].userName = userName
        this.emit("usersUpdated", getLoggedInUsers(this.users))
    }
    getUserName(clientInstanceId) {
        return this.users[clientInstanceId].userName
    }
}

module.exports = UserStore;
