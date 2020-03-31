import * as WebSocket from "ws"

const wss = new WebSocket.Server({port: 8080})

wss.on("connection", function connection(ws, req) {
    console.log("Connection from " + req.connection.remoteAddress)
    ws.on("message", function message(data) {
        console.log("Message received: ", data)
        wss.clients.forEach(function eachClient(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data)
            }
        })

    })
})