const {sendTo, sendToAll, sendToOthers} = require("./send")
const {getLoggedInUsers, userExists, deleteUser, addUser} = require("./users")

const WebSocket = require("ws")

function parseAction(data) {
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

function updateUsers(wss) {
    const loggedInUsers = getLoggedInUsers()

    sendToAll(wss, {
        type: "presence/updateUsers",
        payload: loggedInUsers
    })
}

function handleRequest(request, ws, wss) {
    console.log("request type \"" + request.type + "\"")
    switch (request.type) {
        case "connection/loginToSocket": {
            const {clientInstanceId, userName} = request.payload;
            if (userExists(clientInstanceId)) {
                // userName already exists
                sendTo(ws, {
                    type: "loginerror",
                    message: "ID unavailable"
                })
            } else {
                addUser(ws, clientInstanceId, userName)
                updateUsers(wss)
            }
            break;
        }

        default:
            const {transient, persistent} = request.meta
            console.log("Unknown request", request, transient, persistent)
            sendToOthers(wss, ws, request)

    }
}

const port = 8080;
const wss = new WebSocket.Server({port})

console.log("Listening on ", port)

wss.on("connection", function connection(ws, req) {
    console.log("Connection from " + req.connection.remoteAddress)
    ws.on("message", function message(data) {
        const request = parseAction(data)
        if (request) {
            handleRequest(request, ws, wss)
        }
    })

    ws.on("close", function close(ws) {
        const {id} = this
        if (id) {
            deleteUser(id)
            updateUsers(wss)
        }
    });
    sendTo(ws, {type:"connection/updateConnectionStatus", payload: true, clientInstanceId: "server"})
})

