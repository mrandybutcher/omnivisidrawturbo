import {all} from "redux-saga/effects"
import websocketSaga from "../features/webrtc/signallingWebSocketSaga";
import webRtcSaga from "../features/webrtc/webRtcSaga";


export default function* rootSaga() {
    yield all([
        // websocketSaga(),
        // webRtcSaga()
    ])

}