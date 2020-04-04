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

interface MakeOffer {
    readonly type: "makeoffer"
    readonly recipientId: string
    readonly offer: string
}

interface MakeAnswer {
    readonly type: "makeanswer"
    readonly recipientId: string
    readonly answer: string
}

interface MakeCandiate {
    readonly type: "makecandidate"
    readonly recipientId: string
    readonly candidate: string
}

type RequestMessage = LoginRequest | UpdateUserName | MakeOffer | MakeAnswer | MakeCandiate

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

interface OfferMessage {
    readonly type: "offer",
    readonly offer: string,
    readonly fromId: string,
    readonly fromName: string
}

interface AnswerMessage {
    readonly type: "answer",
    readonly answer: string,
    readonly fromId: string,
    readonly fromName: string
}

interface CandidateMessage {
    readonly type: "candidate"
    readonly fromId: string,
    readonly recipientId: string
    readonly candidate: string
}


type ResponseMessage =
    LoginErrorResponse
    | UpdateUsersMessage
    | ConnectedMessage
    | OfferMessage
    | AnswerMessage
    | CandidateMessage

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
            console.log("Invalid JSON", e);
            return undefined
        }
    } else {
        console.warn("data type is not string", data)
    }
}

function updateUsers(wss: WebSocket.Server) {
    const loggedInUsers = Object.values(
        users
    ).map(({id, userName}) => ({id, userName}));

    sendToAll(wss, {
        type: "updateusers",
        users: loggedInUsers
    })
}

function handleRequest(request: RequestMessage, ws: WebSocket & UserInfo, wss: WebSocket.Server) {
    console.log("request type \"" + request.type + "\"")
    switch (request.type) {
        case "login": {
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
                updateUsers(wss)

            }
            break;
        }
        case "updateusername": {
            if (users[request.id]) {
                users[request.id].userName = request.userName;
                updateUsers(wss)

            } else {
                sendTo(ws, {
                    type: "loginerror",
                    message: "ID not found"
                })
            }
            break;
        }
        case "makeoffer": {
            const {recipientId, offer} = request;
            const user                 = users
            const recipSocket          = users[recipientId]
            if (recipSocket) {
                sendTo(recipSocket, {
                    type: "offer",
                    offer,
                    fromId: ws.id || "",
                    fromName: ws.userName || ""

                });
            }
            break;

        }
        case "makeanswer": {
            const {recipientId, answer} = request;
            const user                  = users
            const recipSocket           = users[recipientId]
            if (recipSocket) {
                sendTo(recipSocket, {
                    type: "answer",
                    answer,
                    fromId: ws.id || "",
                    fromName: ws.userName || ""
                });
            }
            break;
        }
        case "makecandidate": {
            const {recipientId, candidate} = request;
            const user                     = users
            const recipSocket              = users[recipientId]
            if (recipSocket) {
                sendTo(recipSocket, {
                    type: "candidate",
                    candidate,
                    fromId: ws.id || "",
                    recipientId
                });
            }
            break;

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
        console.log(data)

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
