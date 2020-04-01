import {call, fork, put, select, take, takeEvery} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import {selectUserId} from "../../app/selectors";
import {
    answerReceived,
    candidateReceived,
    connectToUser,
    offerReceived,
    offerUser,
    sendAnswer,
    sendCandidate,
    sendOffer
} from "./actions";

const configuration = {
    iceServers: [{urls: "stun:stun.1.google.com:19302"}]
}

function createRTCPeerConnection(): RTCPeerConnection {
    return new RTCPeerConnection(configuration)
}

function createRTCPeerConnectionChannel(connection: RTCPeerConnection) {
    return eventChannel(emit => {

        connection.onconnectionstatechange = function (event) {
            console.log("connection state change", this.connectionState)
        }

        connection.onicecandidate = function (event) {
            console.log("onicecandiate", event)
            const candidate = event.candidate?.toJSON()
            console.log("onicecandiate", event.candidate)
            if (candidate) {
                emit(candidate)
            }

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

        let dataChannel       = connection.createDataChannel("steve")
        dataChannel.onopen    = function (err) {
            console.log("data channel OPEN")
        }
        dataChannel.onerror   = function (err) {
            console.log("data channel error", err)
        }
        dataChannel.onmessage = function (evt) {
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
                recipientId: action.payload.recipientId,
                offer: connection.localDescription?.sdp || ""
            }
            return sendOffer(message)
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
            const message = {
                fromId: id,
                recipientId: action.payload.fromId,
                answer: connection.localDescription?.sdp || ""
            }
            console.log("creatAnswer", message)
            return sendAnswer(message)
        })
        .catch(e => {
            console.warn(e)
        })
}


function startAnswerRecieved(connection: RTCPeerConnection, action: any) {
    console.log("Answer recieved!", action)
    connection.setRemoteDescription(new RTCSessionDescription({
        type: "answer",
        sdp: action.payload.answer
    }))
    console.log("Answer processed")
}

function* watchAnswerReceived(connection: RTCPeerConnection) {
    yield takeEvery<string, any>(answerReceived.type, startAnswerRecieved, connection)
}

function startCandidateRecieved(connection: RTCPeerConnection, action: any) {
    console.log("Candidate recieved!", action)
    connection.addIceCandidate(new RTCIceCandidate(action.payload.candidate))
    console.log("Candidate processed")
}

function* watchCandidateReceived(connection: RTCPeerConnection) {
    yield takeEvery<string, any>(candidateReceived.type, startCandidateRecieved, connection)
}

function* createCandidate(candidate: RTCIceCandidate) {

}

// creates connection ready to send to other user
function* startConnectToUser(action: any) {
    const id          = yield select(selectUserId)
    const recipientId = action.payload.recipientId;
    console.log("Starting connection to ", recipientId)
    console.log("My id is ", id)

    const peerConnection = yield call(createRTCPeerConnection)
    const peerChannel    = yield call(createRTCPeerConnectionChannel, peerConnection)
    const dataChannel    = yield call(createDataChannel, peerConnection)
    console.log("connection and peer created")

    yield fork(watchMakeOffer, peerConnection)
    yield fork(watchAnswerReceived, peerConnection)
    yield fork(watchCandidateReceived, peerConnection)

    yield put(offerUser({recipientId: action.payload.recipientId}))


    while (true) {
        const candidate = yield take(peerChannel)
        yield put(sendCandidate({fromId: id, recipientId, candidate}))
        console.log("something recieved", peerChannel, candidate)

        // const data = yield take(dataChannel)
        // console.log("got some data", data)
    }
}


// creates connection ready to receive from other user
function* startReceiveOffer(action: any) {
    console.log("startRecieveOffer", action)
    const id     = yield select(selectUserId)
    const fromId = action.payload.fromId;
    console.log("Starting requested connection from ", fromId)
    console.log("My id is ", id)


    const peerConnection = yield call(createRTCPeerConnection)
    const peerChannel    = yield call(createRTCPeerConnectionChannel, peerConnection)
    const dataChannel    = yield call(createDataChannel, peerConnection)

    yield fork(watchCandidateReceived, peerConnection)

    console.log("creating answer")
    const answer = yield call(createAnswer, peerConnection, action, id)
    yield put(answer)
    console.log("answer created", answer)

    while (true) {
        const candidate = yield take(peerChannel)
        // yield put(createCandidate, candidate)
        yield put(sendCandidate({fromId: id, recipientId: fromId, candidate}))
        console.log("something recieved", peerChannel, candidate)

        // const data = yield take(dataChannel)
        // console.log("got some data", data)
    }
}

function* watchOfferReceived() {
    yield takeEvery<string, any>(offerReceived.type, startReceiveOffer)
}

function* watchConnectToUser() {
    yield takeEvery<string, any>(connectToUser.type, startConnectToUser)
}

export default function* webRtcRootSaga() {
    yield fork(watchConnectToUser)
    yield fork(watchOfferReceived)
}