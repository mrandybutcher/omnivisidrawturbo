import {apply, call, fork, put, select, take, takeEvery} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import {selectUserId, selectUserName} from "../../app/selectors";
import {
    answerReceived,
    candidateReceived,
    offerReceived,
    sendAnswer,
    sendCandidate,
    sendOffer,
    updateName,
    usersUpdated,
    webSocketConnectionStatus
} from "./actions";

function createWebSocketConnection(): WebSocket {
    // return new WebSocket("ws://192.168.0.25:8080")
    return new WebSocket("wss://ws.r3b.dev/")
    // return new WebSocket("ws://omnivis.herokuapp.com:8080")
}

function createWebSocketChannel(ws: WebSocket) {
    return eventChannel(emit => {

        ws.onclose = function (e) {
            console.log("Signalling websocket closing", e)
            emit(new Error(e.reason))
        }
        ws.onerror = function(e) {
            console.log("Signalling websocket error", e)
        }

        ws.onopen = function (e) {
            console.log("Signalling websocket opening")
        }

        ws.onmessage = function (msg) {
            const data = JSON.parse(msg.data)
            // console.log("Message recieved", data)
            emit(data)
        }

        return () => {
            console.log("Signalling closing websocket")
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

function* signalOffer(socket: WebSocket, action: any) {
    // console.log("send offer", action)
    const msg = JSON.stringify({
        recipientId: action.payload.recipientId,
        offer: action.payload.offer,
        type: "makeoffer"
    })
    // console.log("sendOfferMessage", msg)
    yield apply(socket, socket.send, [msg])
}

function* signalAnswer(socket: WebSocket, action: any) {
    console.log("send answer", action)
    const msg = JSON.stringify({
        recipientId: action.payload.recipientId,
        answer: action.payload.answer,
        type: "makeanswer"
    })
    // console.log("sendAnswerMessage", msg)
    yield apply(socket, socket.send, [msg])
}

function* signalCandidate(socket: WebSocket, action: any) {
    console.log("send candidate", action)
    const msg = JSON.stringify({
        recipientId: action.payload.recipientId,
        candidate: action.payload.candidate,
        type: "makecandidate"
    })
    // console.log("sendCandidate message", msg)
    yield apply(socket, socket.send, [msg])
}

function* watchAnswersToMake(socket: WebSocket) {
    yield takeEvery<string, any>(sendAnswer.type, signalAnswer, socket)
}

function* watchOffersToMake(socket: WebSocket) {
    yield takeEvery<string, any>(sendOffer.type, signalOffer, socket)
}

function* watchSendCandidate(socket: WebSocket) {
    yield takeEvery<string, any>(sendCandidate.type, signalCandidate, socket)
}

export default function* websocketRootSaga() {
    const socket        = yield call(createWebSocketConnection)
    const socketChannel = yield call(createWebSocketChannel, socket)

    yield fork(watchNameUpdate, socket)
    yield fork(watchOffersToMake, socket)
    yield fork(watchAnswersToMake, socket)
    yield fork(watchSendCandidate, socket)

    while (true) {
        try {
            // an error from socketChannel causes it to jump to the catch
            const payload = yield take(socketChannel)
            switch (payload.type) {
                case "connected":
                    yield put(webSocketConnectionStatus(true))
                    yield fork(login, socket)
                    break;
                case "updateusers":
                    yield put(usersUpdated(payload.users))
                    break;
                case "offer":
                    yield put(offerReceived({offer: payload.offer, fromId: payload.fromId, fromName: payload.fromName}))
                    break;
                case "answer":
                    yield put(answerReceived({
                        answer: payload.answer,
                        fromId: payload.fromId,
                        fromName: payload.fromName
                    }))
                    break;
                case "candidate":
                    yield put(candidateReceived({
                        candidate: payload.candidate,
                        fromId: payload.fromId,
                        fromName: payload.fromName
                    }))
                    break;
                default:
                    console.warn("unknown message from websocket", payload)
            }

        } catch (err) {
            console.error("socket error", err)
            // socket still open
            socketChannel.close()
            yield put(webSocketConnectionStatus(false))
        }
    }
}