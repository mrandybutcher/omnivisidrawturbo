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
    userConnectionStatus, userDataConnectionStatus
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
            // console.log("onicecandidate", event)
            const candidate = event.candidate?.toJSON()
            // console.log("onicecandidate", event.candidate)
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

// creates a channel which emits changes to the status of the peer connection
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

// watches for peerConnection status changes and emits userConnectionStatus event with the status of the connection
function* watchPeerConnectionStatus(connection: RTCPeerConnection, fromId: string, recipientId: string) {
    const channel = createPeerConnectionStatusChannel(connection)
    while (true) {
        const status = yield take(channel)
        yield put(userConnectionStatus({fromId, recipientId, status}))
        console.log("PEER connection status update recieved",  status, fromId, recipientId)
    }
}


// returns a promise which returns the dataChannel from a remote initiated peer connection when it is established
function getReceivingDataChannel(connection: RTCPeerConnection) {
    return new Promise((resolve, reject) => {
        connection.ondatachannel = function (event) {
            console.log("receiving datachannel created", event)
            const receiveChannel = event.channel
            resolve(receiveChannel)
        }
    })
}

function createDataChannelConnectionStatusChannel(dataChannel: RTCDataChannel) {
    return eventChannel(emit => {
        dataChannel.onopen    = function (err) {
            console.log("data channel OPEN")
            emit(dataChannel.readyState)
        }
        dataChannel.onerror   = function (err) {
            console.log("data channel error", err)
            emit(dataChannel.readyState)
        }
        // dataChannel.addEventListener(onmessage)
        // dataChannel.onmessage = function (evt) {
        //     console.log("data channel message", evt)
        //     emit(dataChannel.readyState)
        // }
        dataChannel.onclose   = function (evt) {
            console.log("data channel closed", evt)
            emit(dataChannel.readyState)
        }
        return () => {
            console.log("Closing data channel")
            // dataChannel.close()
            emit(dataChannel.readyState)
        }
    })
}

// watches for data channel status connection changes and emits userDataConnectionStatus event with the status of the connection
function* watchDataChannelConnectionStatus(dataChannel: RTCDataChannel, fromId: string, recipientId: string) {
    const channel = createDataChannelConnectionStatusChannel(dataChannel)
    while (true) {
        const status = yield take(channel)
        yield put(userDataConnectionStatus({fromId, recipientId, status}))
        console.log("DATA CHANNEL: connection status update recieved", status, fromId, recipientId)
    }
}


// creates a data channel when you are the initiating side
function createDataChannel(connection: RTCPeerConnection): RTCDataChannel {
    let dataChannel: RTCDataChannel = connection.createDataChannel("steve")
    return dataChannel
}



// creates a channel which emits messages from the data channel
function createDataChannelMessageChannel(dataChannel: RTCDataChannel, fromId: string, recipientId: string) {
    return eventChannel(emit => {
        dataChannel.onmessage = function (evt) {
            // console.log("data channel message", evt)
            emit(JSON.parse(evt.data))
            // updateDataChannelConnectionStatus(dataChannel, fromId, recipientId)
        }
        return () => {
            console.log("Closing data channel")
            dataChannel.close()
        }
    })
}

// watches for message events from the datachannel and dispatches them as actions
function* watchDataChannelMessageChannel(messageChannel: any, fromId: string, recipientId: string) {
    while (true) {
        const event = yield take(messageChannel)
        switch (event.type) {
            case "ui/mouseMove": {
                // console.log("putting action", event)
                const point = event.payload
                yield put(updateGhostMouse({fromId: recipientId, point}))
                break;
            }
            default:
                console.log("found unknown data type", event.type, event)

        }
        // console.log("DATA channel message recieved", messageChannel, event, fromId, recipientId)
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
                offer: connection.localDescription?.toJSON()
            }
            return sendOffer(message)
        })
        .catch(e => {
            console.warn(e)
        })
}

// watches for an offer from the signalling websocket
function* watchMakeOffer(connection: RTCPeerConnection) {
    yield takeEvery<string, any>(offerUser.type, function* (connection: RTCPeerConnection, action: any) {
        const id = yield select(selectUserId)
        // console.log("creating offer")
        const offer = yield call(createOfferAction, connection, action, id)
        yield put(offer)
        console.log("offer created", offer)
    }, connection)
}

// creates an answer to the offer, ready to be sent back over the websocket
function createAnswerAction(connection: RTCPeerConnection, action: any, id: string) {
    console.log("making answer", action)
    return connection.setRemoteDescription(new RTCSessionDescription(
        action.payload.offer
    ))
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
        // console.log("Answer processed")
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


// watches for local mouseMove actions and dispatches them over the data channel
function* watchMouseMove(dataChannel: RTCDataChannel) {
    yield takeEvery<string, any>(canvasMouseMove.type, function (dataChannel: RTCDataChannel, action: any) {
        // console.log("signal mouse move", dataChannel.readyState, action)
        if (dataChannel && dataChannel.readyState === "open") {
            // console.log("data channel sending", JSON.stringify(action))
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


// creates connection and sends to other user
function* startConnectingToUserSaga(action: any) {
    const id          = yield select(selectUserId)
    const recipientId = action.payload.recipientId;

    console.log("My id is ", id)
    console.log("Starting connection to ", recipientId)

    // create the connection
    const peerConnection = yield call(createPeerConnection)

    // setup watchers for when the connection has things we need to do
    yield fork(watchPeerConnectionStatus, peerConnection, id, recipientId)
    yield fork(watchConnectionForCandidates, peerConnection, id, recipientId)
    yield fork(watchAnswerReceivedSignal, peerConnection)
    yield fork(watchMakeOffer, peerConnection)
    yield fork(watchCandidateReceivedSignal, peerConnection)

    // we are the initiator, so create the data channel
    const sendDataChannel = yield call(createDataChannel, peerConnection)

    // watch the data channel connection status
    yield fork(watchDataChannelConnectionStatus, sendDataChannel, id, recipientId)

    // create the channel to get messages when data recieved
    const messageChannel = createDataChannelMessageChannel(sendDataChannel, id, recipientId)

    // watch and process the messsages when they arrive from the other end
    yield fork(watchDataChannelMessageChannel, messageChannel, id, recipientId)

    // send an offer via the signalling server to the other end
    yield put(offerUser({recipientId}))

    // start sending our mouse events over the data channel
    yield fork(watchMouseMove, sendDataChannel)
}


// creates connection ready to receive from other user
function* startRecievingConnectionFromOtherUserSaga(action: any) {
    const id     = yield select(selectUserId)
    const fromId = action.payload.fromId;
    console.log("My id is ", id)
    console.log("Starting requested connection from ", fromId)

    // create the connection
    const peerConnection = yield call(createPeerConnection)

    // setup watchers for when the connection has things we need to do
    yield fork(watchPeerConnectionStatus, peerConnection, id, fromId)
    yield fork(watchConnectionForCandidates, peerConnection, id, fromId)
    yield fork(watchCandidateReceivedSignal, peerConnection)

    // create an answer to the offer we recieved over the signalling websocket
    const answer = yield call(createAnswerAction, peerConnection, action, id)

    // send the answer back over the websocket
    yield put(answer)

    // setup the data channel
    const receiveDataChannel = yield call(getReceivingDataChannel, peerConnection)

    // watch the data channel connection status
    yield fork(watchDataChannelConnectionStatus, receiveDataChannel, fromId, id)

    // create a channel to get messages when data recieved
    const messageChannel = createDataChannelMessageChannel(receiveDataChannel, fromId, id)

    // watch and process the messages when they arrive from the other end
    yield fork(watchDataChannelMessageChannel, messageChannel, id, fromId)

    // start sending our mouse events over the data channel
    yield fork(watchMouseMove, receiveDataChannel)
}

export default function* webRtcRootSaga() {
    yield fork(function* watchConnectToUser() {
        // when someone clicks the connect button on this side start a saga
        yield takeEvery<string, any>(connectToUser.type, startConnectingToUserSaga)
    })
    yield fork(function* watchOfferReceived() {
        // when we recieve an offer to conenct from the other side via the signalling websocket start a saga
        yield takeEvery<string, any>(offerReceived.type, startRecievingConnectionFromOtherUserSaga)
    })
}