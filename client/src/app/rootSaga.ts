import {all, apply, call, fork, put, select, take, takeEvery} from "redux-saga/effects"
import {eventChannel} from "redux-saga"
import {
    answerReceived,
    makeAnswer,
    makeOffer,
    offerReceived,
    offerUser,
    updateConnected,
    updateName,
    updateUsers
} from "../features/presence/actions";
import {selectUserId, selectUserName} from "./selectors";

const configuration = {
    iceServers: [{urls: "stun:stun.1.google.com:19302"}]
}

function createRTCPeerConnection(): RTCPeerConnection {
    return new RTCPeerConnection(configuration)
}

function createRTCPeerConnectionChannel(connection: RTCPeerConnection) {
    return eventChannel(emit => {

        connection.onicecandidate = function (event) {
            console.log("onicecandiate", event)

        }
        connection.ondatachannel  = function (event) {
            console.log("ondatachannel created", event)
            const receiveChannel     = event.channel
            receiveChannel.onopen    = function () {
                console.log("receive channel open")
            }
            receiveChannel.onmessage = function (event) {
                console.log("Message Recieved", event)
                emit(event.data)
            }
        }

        return () => {
            console.log("Unsubscribing from peer channel")
            connection.close()
        }
    })
}

function createDataChannel(connection: RTCPeerConnection) {
    return eventChannel(emit => {
        const dataChannelOptions = {
            reliable: true
        }
        let dataChannel          = connection.createDataChannel("steve")
        dataChannel.onerror      = function (err) {
            console.log("data channel error", err)
        }
        dataChannel.onmessage    = function (evt) {
            console.log("data channel message", evt)
            emit(evt.data)
        }
        return () => {
            console.log("Closing data channel")
            dataChannel.close()
        }
    })
}

function createOffer(connection: RTCPeerConnection, action: any, id: string) {
    console.log("making offer ", action)
    return connection.createOffer()
        .then(offer => connection.setLocalDescription(offer))
        .then(() => {
            console.log("Making offer ", connection.localDescription)
            const message = {
                fromId: id,
                recipientId: action.payload as string,
                offer: connection.localDescription?.sdp || ""
            }
            return makeOffer(message)
        })
        .catch(e => {
            console.warn(e)
        })
}

function* startMakeOffer(connection: RTCPeerConnection, action: any) {
    const id = yield select(selectUserId)
    console.log("creating offer")
    const offer = yield call(createOffer, connection, action, id)
    yield put(offer)
    console.log("offer created", offer)
}

function* watchMakeOffer(connection: RTCPeerConnection) {
    console.log("watching offers")
    yield takeEvery<string, any>(offerUser.type, startMakeOffer, connection)
}

function createAnswer(connection: RTCPeerConnection, action: any, id: string) {
    console.log("making answer", action)
    return connection.setRemoteDescription(new RTCSessionDescription({
        type: "offer",
        sdp: action.payload.offer
    }))
        .then(() => connection.createAnswer())
        .then(answer => connection.setLocalDescription(answer))
        .then(() => {
            console.log("making answer", connection.localDescription)
            const message = {fromId: id, recipientId: action.payload.id, answer: connection.localDescription?.sdp || ""}
            return makeAnswer(message)
        })
        .catch(e => {
            console.warn(e)
        })
}

function* startReceiveOffer(connection: RTCPeerConnection, action: any) {
    console.log("startRecieveOffer", action)

    const id = yield select(selectUserId)
    console.log("creating answer")
    const answer = yield call(createAnswer, connection, action, id)
    yield put(answer)
    console.log("answer created", answer)
}


function* watchOfferReceived(connection: RTCPeerConnection) {
    console.log("Waiting to receive offers")
    yield takeEvery<string, any>(offerReceived.type, startReceiveOffer, connection)
}

function* webRtcSaga() {
    console.log("starting webrtc saga")
    const peerConnection = yield call(createRTCPeerConnection)
    const peerChannel    = yield call(createRTCPeerConnectionChannel, peerConnection)
    const dataChannel    = yield call(createDataChannel, peerConnection)
    console.log("connection and peer created")

    yield fork(watchMakeOffer, peerConnection)
    yield fork(watchOfferReceived, peerConnection)

    while (true) {
        const payload = yield take(peerChannel)
        console.log("something recieved", peerChannel)
        const data = yield take(dataChannel)
        console.log("got some data", data)
    }
}

///////////////////////
function createWebSocketConnection(): WebSocket {
    return new WebSocket("ws://192.168.0.25:8080")
}

function createWebSocketChannel(ws: WebSocket) {
    return eventChannel(emit => {

        ws.onclose = function (e) {
            console.log("websocket closing")
            emit(new Error(e.reason))
        }

        ws.onopen = function (e) {
            console.log("websocket opening")
        }

        ws.onmessage = function (msg) {
            const data = JSON.parse(msg.data)
            console.log("Message recieved", data)
            emit(data)
        }

        return () => {
            console.log("unsubscribe")
            console.log("closing socket")
            ws.close()
        };
    })
}

function* login(socket: WebSocket) {
    const userName = yield select(selectUserName)
    const id       = yield select(selectUserId)
    const message  = JSON.stringify({type: "login", id, userName})
    yield apply(socket, socket.send, [message])
}

function* nameUpdate(socket: WebSocket, action: any) {
    const id       = yield select(selectUserId)
    const userName = yield select(selectUserName)
    const message  = JSON.stringify({type: "updateusername", id, userName})
    yield apply(socket, socket.send, [message])
}

function* watchNameUpdate(socket: WebSocket) {
    yield takeEvery<string, any>(updateName.type, nameUpdate, socket)
}

function* sendOffer(socket: WebSocket, action: any) {
    console.log("send offer", action)
    const msg = JSON.stringify({
        ...action.payload,
        type: "makeoffer"
    })
    console.log("sendOfferMessage", msg)
    yield apply(socket, socket.send, [msg])
}

function* sendAnswer(socket: WebSocket, action: any) {
    console.log("send answer", action)
    const msg = JSON.stringify({
        ...action.payload,
        type: "makeanswer"
    })
    console.log("sendAnswerMessage", msg)
    yield apply(socket, socket.send, [msg])

}

function* watchAnswersToMake(socket: WebSocket) {
    console.log("Watching answers to make")
    yield takeEvery<string, any>(makeAnswer.type, sendAnswer, socket)
}

function* watchOffersToMake(socket: WebSocket) {
    console.log("Watching offers to make")
    yield takeEvery<string, any>(makeOffer.type, sendOffer, socket)
}

function* websocketSaga() {
    console.log("starting websocket saga")
    const socket: any   = yield call(createWebSocketConnection)
    const socketChannel = yield call(createWebSocketChannel, socket)
    console.log("socket and channel created")

    yield fork(watchNameUpdate, socket)
    yield fork(watchOffersToMake, socket)
    yield fork(watchAnswersToMake, socket)

    while (true) {
        try {
            // an error from socketChannel causes it to jump to the catch
            const payload = yield take(socketChannel)
            switch (payload.type) {
                case "connected":
                    yield put(updateConnected(true))
                    yield fork(login, socket)
                    break;
                case "updateusers":
                    yield put(updateUsers(payload.users))
                    break;
                case "offer":
                    yield put(offerReceived({offer: payload.offer, fromId: payload.fromId, fromName: payload.fromName}))
                    break;
                case "answer":
                    yield put(answerReceived({answer: payload.offer, fromId: payload.fromId, fromName: payload.fromName}))
                    break;
            }

        } catch (err) {
            console.error("socket error", err)
            // socket still open
            socketChannel.close()
        }
    }
}


export default function* rootSaga() {
    yield all([
        websocketSaga(),
        webRtcSaga()
    ])

}