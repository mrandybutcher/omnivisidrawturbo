import {apply, call, fork, put, select, take, takeEvery} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import {selectUserId, selectUserName} from "../../app/selectors";
import {loginToSocket, updateConnectionStatus} from "./actions"
import {AnyAction} from "redux"

function createWebSocketConnection(): WebSocket {
    const url = process.env.REACT_APP_WS_SERVER;
    if (!url) {
        throw Error("No websocket server defined")
    }
    return new WebSocket(url)
}

function createWebSocketChannel(ws: WebSocket) {
    return eventChannel(emit => {
        ws.onclose = function (e) {
            console.log("websocket closing", e)
            emit(updateConnectionStatus(false))
            emit(new Error(e.reason))
        }
        ws.onerror = function (e) {
            console.log("websocket error", e)
        }

        ws.onopen = function (e) {
            console.log("websocket opening")
            // emit(updateConnectionStatus(true))
        }

        ws.onmessage = function (msg) {
            const data = JSON.parse(msg.data)
            // console.log("Message recieved", data)
            emit(data)
        }

        return () => {
            console.log("closing websocket")
            ws.close()
        };
    })
}

// function* doLogin(socket: WebSocket) {
//     const userName = yield select(selectUserName)
//     const id       = yield select(selectUserId)
//     const message  = JSON.stringify(loginToSocket({clientInstanceId: id, userName}))
//     yield apply(socket, socket.send, [message])
// }
//
// function* watchNameUpdate(socket: WebSocket) {
//     yield takeEvery<string, any>(updateName.type, function* (socket: WebSocket, action: any) {
//         const id       = yield select(selectUserId)
//         const userName = yield select(selectUserName)
//         const message  = JSON.stringify({type: "updateusername", id, userName})
//         yield apply(socket, socket.send, [message])
//     }, socket)
// }

function* watchConnectionStatus(socket: WebSocket) {
    yield takeEvery<string, any>(updateConnectionStatus.type, function* (socket: WebSocket, action: any) {
        if (action.payload) {
            const id       = yield select(selectUserId)
            const userName = yield select(selectUserName)
            const message  = JSON.stringify(loginToSocket({clientInstanceId: id, userName}))
            yield apply(socket, socket.send, [message])
        }
    }, socket)
}

function* watchForEvents(socket: WebSocket) {
    const id = yield select(selectUserId)
    yield takeEvery<AnyAction, any>(
        (action: any) => action.meta && (action.meta.transient || action.meta.persistent),
        function* (socket: WebSocket, action: AnyAction) {
            if (action.meta.clientInstanceId !== id) {
                // console.log("skipping sending as not from me", action)
                return;
            }
            // console.log("action", action)
            const msg = JSON.stringify(action)
            yield apply(socket, socket.send, [msg])
        }, socket)
}


export default function* connectionSaga() {
    const socket        = yield call(createWebSocketConnection)
    const socketChannel = yield call(createWebSocketChannel, socket)

    yield fork(watchConnectionStatus, socket)
    yield fork(watchForEvents, socket)

    while (true) {
        try {
            // an error from socketChannel causes it to jump to the catch
            const payload = yield take(socketChannel)
            yield put(payload)
            // switch (payload.type) {
            //     case "connected":
            //         yield put(updateConnectionStatus(true))
            //         yield fork(doLogin, socket)
            //         break;
            //     default:
            //         console.warn("unknown message from websocket", payload)
            // }

        } catch (err) {
            console.error("socket error", err)
            // socket still open
            socketChannel.close()
            yield put(updateConnectionStatus(false))
        }
    }
}