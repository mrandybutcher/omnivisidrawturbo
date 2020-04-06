import {all} from "redux-saga/effects"
import connectionSaga from "../features/connection/connectionSaga"

export default function* rootSaga() {
    yield all([
        connectionSaga()
    ])
}