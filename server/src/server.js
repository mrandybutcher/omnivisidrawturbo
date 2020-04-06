const WebSocket = require("ws")

const users = {};


function sendTo(connection, action) {
    console.log("send to one", action)
    connection.send(JSON.stringify(action));
}

function sendToOthers(wss, ws, action) {
    console.log("send to all other clients", action)
    wss.clients.forEach(function eachClient(client) {
        console.log("sending")
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            console.log("and open and not current")
            client.send(JSON.stringify(action))
        }
    })
}

function sendToAll(wss, action) {
    console.log("send to all clients", action)
    wss.clients.forEach(function eachClient(client) {
        console.log("sending")
        if (client.readyState === WebSocket.OPEN) {
            console.log("and open")
            client.send(JSON.stringify(action))
        }
    })
}


function parseAction(data) {
    console.log("Received data: %s", data);
    if (typeof data === "string") {
        try {
            return JSON.parse(data)
        } catch (e) {
            console.log("Invalid JSON", e);
            return undefined
        }
    } else {
        console.warn("data type is not string", data)
    }
}

function updateUsers(wss) {
    const loggedInUsers = Object.values(
        users
    ).map(({id, userName}) => ({id, userName}));

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
            if (users[clientInstanceId]) {
                // userName already exists
                sendTo(ws, {
                    type: "loginerror",
                    message: "ID unavailable"
                })
            } else {
                users[clientInstanceId] = ws;
                users[clientInstanceId].userName = userName;
                users[clientInstanceId].id = clientInstanceId;
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
        console.log("Message received: ", data)
        console.log(data)

        const request = parseAction(data)
        if (request) {
            handleRequest(request, ws, wss)
        }

    })

    ws.on("close", function close(ws) {
        const {id, userName} = this
        if (id) {
            delete users[id];

            const loggedInUsers = Object.values(
                users
            ).map(({id, userName}) => ({id, userName}));

            sendToAll(wss, {
                type: "updateusers",
                users: loggedInUsers,
            })
        }
    });
    sendTo(ws, {type:"connection/updateConnectionStatus", payload: true, clientInstanceId: "server"})
})

