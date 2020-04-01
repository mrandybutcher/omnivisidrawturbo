import {all, apply, call, fork, put, select, take, takeEvery} from "redux-saga/effects"
import {eventChannel} from "redux-saga"
import {updateConnected, updateName, updateUsers} from "../features/presence/actions";
import {selectUserId, selectUserName} from "./selectors";


function createSocketConnection(): WebSocket {
    return new WebSocket("ws://192.168.0.25:8080")
}

function createSocketChannel(ws: WebSocket) {
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

        const unsubscribe = () => {
            console.log("unsubscribe")
            console.log("closing socket")
            ws.close()
        }
        return unsubscribe;
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

function* websocketSaga() {
    console.log("starting websocket saga")
    const socket        = yield call(createSocketConnection)
    const socketChannel = yield call(createSocketChannel, socket)
    console.log("socket and channel created")

    yield fork(watchNameUpdate, socket)

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
        websocketSaga()
    ])

}