const {sendTo, sendToAll, sendToOthers} = require("./send")
const UserStore = require("./UserStore")
const EventStore = require("./EventStore")
const WebSocket = require("ws")

function parseMessage(data) {
    console.log("Received data: %s", data);
    if (typeof data === "string") {
        try {
            return JSON.parse(data)
        } catch (e) {
            console.warn("Invalid JSON", e);
            return undefined
        }
    } else {
        console.warn("data type is not string", data)
        return undefined
    }
}

function onWsMessage(data, ws, wss, userStore, eventStore) {
    const message = parseMessage(data)
    console.log("message type \"" + message.type + "\"")
    switch (message.type) {
        case "connection/loginToSocket": {
            const {clientInstanceId, userName} = message.payload;
            if (userStore.userExists(clientInstanceId)) {
                console.warn("user already exists", clientInstanceId)
                break;
            }
            userStore.addUser(ws, clientInstanceId, userName)
            break;
        }
        case "connection/updateName": {
            const userName = message.payload;
            const clientInstanceId = message.meta.clientInstanceId;
            userStore.updateUserName(clientInstanceId, userName)
            break;
        }

        default:
            const {transient, persistent} = message.meta
            if (transient) {
                if (message.type !== "ui/mouseMove" && message.type !== "ui/mouseLeave") {
                    console.log("Transient message", message, transient, persistent)
                }
                sendToOthers(wss, ws, message)
            } else if (persistent) {
                console.log("Persistent message", message, transient, persistent)
                eventStore.append(message)
            } else {
                console.warn("message thats not transient or persistent", message)
            }

    }
}

function onWsConnectionClose(ws, wss, userStore) {
    console.log("connection close", ws.id)
    userStore.deleteUser(ws.id)
}

function onWsConnectionOpen(ws, wss) {
    sendTo(ws, {type: "connection/updateConnectionStatus", payload: true, clientInstanceId: "server"})
}

function onUsersUpdated(wss, users) {
    sendToAll(wss, {
        type: "connection/updateUsers",
        payload: users
    })
}

function onEvent(wss, event) {
    sendToAll(wss, event)
}

const port = 8080;
const wss = new WebSocket.Server({port})

const userStore = new UserStore();
const eventStore = new EventStore(userStore);

console.log("Listening on ", port)


eventStore.on("event", function event(event) {
    console.log("calling onEvent", event)
    onEvent(wss, event)
})

userStore.on("usersUpdated", function usersUpdated(users) {
    onUsersUpdated(wss, users)
})

wss.on("connection", function connection(ws, req) {
    console.log("Connection from " + req.connection.remoteAddress)
    ws.on("message", function message(data) {
        onWsMessage(data, ws, wss, userStore, eventStore)
    })
    ws.on("close", function close() {
        onWsConnectionClose(this, wss, userStore)
    });
    onWsConnectionOpen(ws, wss)
})


