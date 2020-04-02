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
    sendOffer,
    updateGhostMouse,
    userConnectionStatus
} from "./actions";
import {canvasMouseMove} from "../ui/actions";

const configuration = {
    iceServers: [{urls: "stun:stun.1.google.com:19302"}]
}

// creates a peer connection
function createPeerConnection(): RTCPeerConnection {
    return new RTCPeerConnection(configuration)
}

// creates a channel which emits candidates from the peer connection
function createPeerConnectionCandidateChannel(connection: RTCPeerConnection) {
    return eventChannel(emit => {
        connection.onicecandidate = function (event) {
            console.log("onicecandiate", event)
            const candidate = event.candidate?.toJSON()
            console.log("onicecandiate", event.candidate)
            if (candidate) {
                emit(candidate)
            }
        }
        return () => {
            console.log("returning from createPeerConnectionCandidateChannel")
            // connection.close()
        }
    })
}

function createPeerConnectionStatusChannel(connection: RTCPeerConnection) {
    return eventChannel(emit => {
        connection.onconnectionstatechange = function (event) {
            console.log("peer connection state change", this.connectionState)
            emit(this.connectionState)
        }
        return () => {
            console.log("returning from createPeerConnectionStatusChannel")
        }
    });
}

function* watchPeerConnectionStatus(connection: RTCPeerConnection, fromId: string, recipientId: string) {
    const channel = createPeerConnectionStatusChannel(connection)
    while (true) {
        const status = yield take(channel)
        yield put(userConnectionStatus({fromId, recipientId, status}))
        console.log("PEER connection status update recieved", channel, status, fromId, recipientId)
        // yield put(sendCandidate({fromId, recipientId, candidate}))
    }
}

function getReceivingDataChannel(connection: RTCPeerConnection) {
    return new Promise((resolve, reject) => {
        connection.ondatachannel = function (event) {
            console.log("receiving datachannel created", event)
            const receiveChannel = event.channel
            resolve(receiveChannel)
        }
    })
}



// creates a data channel
function createDataChannel(connection: RTCPeerConnection): RTCDataChannel {
    let dataChannel: RTCDataChannel = connection.createDataChannel("steve")
    return dataChannel
}

// creates a channel which emits messages from the data channel
function createDataChannelMessageChannel(dataChannel: RTCDataChannel) {
    return eventChannel(emit => {
        dataChannel.onopen    = function (err) {
            console.log("data channel OPEN")
        }
        dataChannel.onerror   = function (err) {
            console.log("data channel error", err)
        }
        dataChannel.onmessage = function (evt) {
            console.log("data channel message", evt)
            emit(JSON.parse(evt.data))
        }
        dataChannel.onclose   = function (evt) {
            console.log("data channel closed", evt)
        }
        return () => {
            console.log("Closing data channel")
            dataChannel.close()
        }
    })
}

function* watchDataChannelMessageChannel(messageChannel: any, fromId: string, recipientId: string) {
    while (true) {
        const event = yield take(messageChannel)
        switch (event.type) {
            case "ui/mouseMove": {
                console.log("putting action", event)
                const point = event.payload
                yield put(updateGhostMouse({fromId, point}))
                break;
            }
            default:
                console.log("found unknown data type", event.type, event)

        }
        console.log("DATA channel message recieved", messageChannel, event, fromId, recipientId)
        // yield put(sendCandidate({fromId, recipientId, candidate}))
    }
}

// creates an offer on the peerconnection and returns an action to be sent over the signalling
function createOfferAction(connection: RTCPeerConnection, action: any, id: string) {
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

function* watchMakeOffer(connection: RTCPeerConnection) {
    console.log("watching offers")
    yield takeEvery<string, any>(offerUser.type, function* (connection: RTCPeerConnection, action: any) {
        const id = yield select(selectUserId)
        console.log("creating offer")
        const offer = yield call(createOfferAction, connection, action, id)
        yield put(offer)
        console.log("offer created", offer)
    }, connection)
}

function createAnswerAction(connection: RTCPeerConnection, action: any, id: string) {
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


// listens for answerReceived action that comes via signalling websocket
function* watchAnswerReceivedSignal(connection: RTCPeerConnection) {
    yield takeEvery<string, any>(answerReceived.type, function (connection: RTCPeerConnection, action: any) {
        console.log("Answer recieved!", action)
        connection.setRemoteDescription(new RTCSessionDescription({
            type: "answer",
            sdp: action.payload.answer
        }))
        console.log("Answer processed")
    }, connection)
}

// listens for candidateReceived action that comes via signalling websocket
function* watchCandidateReceivedSignal(connection: RTCPeerConnection) {
    yield takeEvery<string, any>(candidateReceived.type, function (connection: RTCPeerConnection, action: any) {
        console.log("Candidate recieved!", action)
        connection.addIceCandidate(new RTCIceCandidate(action.payload.candidate))
        console.log("Candidate processed")
    }, connection)
}


function* watchMouseMove(dataChannel: RTCDataChannel) {
    yield takeEvery<string, any>(canvasMouseMove.type, function (dataChannel: RTCDataChannel, action: any) {
        console.log("signal mouse move", dataChannel.readyState, action)
        if (dataChannel && dataChannel.readyState === "open") {
            console.log("data channel sending", JSON.stringify(action))
            dataChannel.send(JSON.stringify(action))
        } else {
            console.log("data channel not ready")
        }
    }, dataChannel);
}

// listens for candidates from the peerconnection and emits the actions to be sent over the signalling websocket
function* watchConnectionForCandidates(connection: RTCPeerConnection, fromId: string, recipientId: string) {
    const candidateChannel = createPeerConnectionCandidateChannel(connection)

    while (true) {
        const candidate = yield take(candidateChannel)
        console.log("candidate recieved", candidateChannel, candidate)
        yield put(sendCandidate({fromId, recipientId, candidate}))
    }
}


// creates connection ready to send to other user
function* startConnectingToUserSaga(action: any) {
    const id          = yield select(selectUserId)
    const recipientId = action.payload.recipientId;

    console.log("Starting connection to ", recipientId)
    console.log("My id is ", id)

    const peerConnection = yield call(createPeerConnection)
    yield fork(watchPeerConnectionStatus, peerConnection, id, recipientId)
    yield fork(watchConnectionForCandidates, peerConnection, id, recipientId)
    yield fork(watchAnswerReceivedSignal, peerConnection)
    yield fork(watchMakeOffer, peerConnection)
    yield fork(watchCandidateReceivedSignal, peerConnection)

    // const peerChannel            = yield call(createRTCPeerConnectionChannel, peerConnection)
    const sendDataChannel = yield call(createDataChannel, peerConnection)
    // const sendDataChannelChannel = yield call(createDataChannelMessageChannel, sendDataChannel)
    console.log("connection and peer created")

    const messageChannel = createDataChannelMessageChannel(sendDataChannel)
    yield fork(watchDataChannelMessageChannel, messageChannel, id, recipientId)

    yield put(offerUser({recipientId}))
    yield fork(watchMouseMove, sendDataChannel)

}


// creates connection ready to receive from other user
function* startRecievingConnectionFromOtherUserSaga(action: any) {
    const id     = yield select(selectUserId)
    const fromId = action.payload.fromId;
    console.log("Starting requested connection from ", fromId)
    console.log("My id is ", id)


    const peerConnection = yield call(createPeerConnection)
    yield fork(watchPeerConnectionStatus, peerConnection, id, fromId)
    yield fork(watchConnectionForCandidates, peerConnection, id, fromId)
    yield fork(watchCandidateReceivedSignal, peerConnection)

    console.log("creating answer")
    const answer = yield call(createAnswerAction, peerConnection, action, id)
    yield put(answer)
    console.log("answer created", answer)
    // const peerChannel    = yield call(createRTCPeerConnectionChannel, peerConnection)
    // const receiveDataChannel    = yield call(createDataChannel, peerConnection)
    console.log("waiting for data channel");
    const receiveDataChannel = yield call(getReceivingDataChannel, peerConnection)
    console.log("recieved dataChannel", receiveDataChannel)

    const messageChannel = createDataChannelMessageChannel(receiveDataChannel)

    yield fork(watchDataChannelMessageChannel, messageChannel, id, fromId)
    yield fork(watchMouseMove, receiveDataChannel)

}

export default function* webRtcRootSaga() {
    yield fork(function* watchConnectToUser() {
        yield takeEvery<string, any>(connectToUser.type, startConnectingToUserSaga)
    })
    yield fork(function* watchOfferReceived() {
        yield takeEvery<string, any>(offerReceived.type, startRecievingConnectionFromOtherUserSaga)
    })
}