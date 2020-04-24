const WebSocket = require("ws")

function sendTo(connection, action) {
    // console.log("send to one", action)
    connection.send(JSON.stringify(action));
}

function sendToOthers(wss, ws, action) {
    console.log("send to other clients", action)
    wss.clients.forEach(function eachClient(client) {
        // console.log("sending")
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            // console.log("and open and not current")
            client.send(JSON.stringify(action))
        }
    })
}

function sendToAll(wss, action) {
    console.log("send to all clients", action)
    wss.clients.forEach(function eachClient(client) {
        // console.log("sending")
        if (client.readyState === WebSocket.OPEN) {
            // console.log("and open")
            client.send(JSON.stringify(action))
        } else {
            // not sure if this happens
            console.log("ERROR sending to closed socket", client)
        }
    })
}

module.exports = {
    sendTo, sendToOthers, sendToAll
}
