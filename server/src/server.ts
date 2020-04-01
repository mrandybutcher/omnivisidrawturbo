import * as WebSocket from "ws"
import {Data} from "ws"


interface LoginRequest {
    readonly type: "login",
    readonly id: string,
    readonly userName: string
}

interface UpdateUserName {
    readonly type: "updateusername",
    readonly id: string,
    readonly userName: string
}

type RequestMessage = LoginRequest | UpdateUserName

interface LoginErrorResponse {
    readonly type: "loginerror"
    readonly message: string
}

interface UpdateUsersMessage {
    readonly type: "updateusers"
    readonly users: UserInfo[]
}

interface ConnectedMessage {
    readonly type: "connected"
}


type ResponseMessage = LoginErrorResponse | UpdateUsersMessage | ConnectedMessage

interface UserInfo {
    userName?: string,
    id?: string
}

interface Users {
    [userName: string]: WebSocket & UserInfo
}

const users: Users = {};


function sendTo(connection: WebSocket, message: ResponseMessage) {
    console.log("send to one", message)
    connection.send(JSON.stringify(message));
}

function sendToAllOthers(wss: WebSocket.Server, ws: WebSocket, message: ResponseMessage) {
    console.log("send to all other clients", message)
    wss.clients.forEach(function eachClient(client) {
        console.log("sending")
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            console.log("and open and not current")
            client.send(JSON.stringify(message))
        }
    })
}

function sendToAll(wss: WebSocket.Server, message: ResponseMessage) {
    console.log("send to all clients", message)
    wss.clients.forEach(function eachClient(client) {
        console.log("sending")
        if (client.readyState === WebSocket.OPEN) {
            console.log("and open")
            client.send(JSON.stringify(message))
        }
    })
}


function parseRequest(data: Data): RequestMessage | undefined {
    console.log("Received data: %s", data);
    if (typeof data === "string") {
        try {
            return JSON.parse(data) as RequestMessage;
        } catch (e) {
            console.log("Invalid JSON");
            return undefined
        }
    } else {
        console.warn("data type is not string", data)
    }
}

function handleRequest(request: RequestMessage, ws: WebSocket, wss: WebSocket.Server) {
    switch (request.type) {
        case "login":
            if (users[request.id]) {
                // userName already exists
                sendTo(ws, {
                    type: "loginerror",
                    message: "ID unavailable"
                })
            } else {

                users[request.id]          = ws;
                users[request.id].userName = request.userName;
                users[request.id].id       = request.id;

                const loggedInUsers = Object.values(
                    users
                ).map(({id, userName}) => ({id, userName}));

                sendToAll(wss,{
                    type: "updateusers",
                    users: loggedInUsers
                })
            }
            break;
        case "updateusername":
            if (users[request.id]) {
                users[request.id].userName = request.userName;

                const loggedInUsers = Object.values(
                    users
                ).map(({id, userName}) => ({id, userName}));

                sendToAll(wss, {
                    type: "updateusers",
                    users: loggedInUsers
                });
            } else {
                sendTo(ws, {
                    type: "loginerror",
                    message: "ID not found"
                })

            }

        default:
            console.log("Unknown request", request)

    }
}

const port = 8080;
const wss  = new WebSocket.Server({port})

console.log("Listening on ", port)

wss.on("connection", function connection(ws: WebSocket, req) {
    console.log("Connection from " + req.connection.remoteAddress)

    ws.on("message", function message(data) {
        console.log("Message received: ", data)

        const request = parseRequest(data)
        if (request) {
            handleRequest(request, ws, wss)
        }

    })
    ws.on("close", function close(ws) {
        const {id, userName} = (this as WebSocket & UserInfo)
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
    sendTo(ws, {type: "connected"})
})
