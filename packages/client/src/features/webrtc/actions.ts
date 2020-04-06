import {createAction} from "@reduxjs/toolkit";
import {withLocalPayload} from "omnivisidrawturbo-shared"
// import {User} from "./webRtcReducer";
// import {Point} from "../../lib/geometry/point";
//
// export const updateName                = createAction("webrtc/updateName", withLocalPayload<string>());
// export const webSocketConnectionStatus = createAction("webrtc/webSocketConnectionStatus", withLocalPayload<boolean>());
// export const userConnectionStatus      = createAction("webrtc/userConnectionStatus", withLocalPayload<{ fromId: string, recipientId: string, status: string }>())
// export const userDataConnectionStatus  = createAction("webrtc/userDataConnectionStatus", withLocalPayload<{ fromId: string, recipientId: string, status: string }>())
//
//
// // sending side
// export const connectToUser  = createAction("webrtc/signalling/connectToUser", withLocalPayload<{ recipientId: string }>())
// export const offerUser      = createAction("webrtc/signalling/offerUser", withLocalPayload<{ recipientId: string }>())
// export const sendOffer      = createAction("webrtc/signalling/sendOffer", withLocalPayload<{ fromId: string, recipientId: string, offer: string }>())
// export const answerReceived = createAction("webrtc/signalling/answerReceived", withLocalPayload<{ fromId: string, fromName: string, answer: string }>())
//
//
// // receiving side
// export const offerReceived = createAction("webrtc/signalling/offerReceived", withLocalPayload<{ fromId: string, fromName: string, offer: string }>())
// export const sendAnswer    = createAction("webtrc/signalling/sendAnswer", withLocalPayload<{ fromId: string, recipientId: string, answer: string }>())
//
// // common to both sides
// export const sendCandidate     = createAction("webrtc/signalling/sendCandidate", withLocalPayload<{ fromId: string, recipientId: string, candidate: string }>())
// export const candidateReceived = createAction("webrtc/signalling/candidateReceived", withLocalPayload<{ fromId: string, fromName: string, candidate: string }>())
// export const usersUpdated      = createAction("webrtc/signalling/usersUpdated", withLocalPayload<User[]>())
//
//
// // actions over data channel
// export const updateGhostMouse = createAction("webrtc/data/updateGhostMouse", withLocalPayload<{ fromId: string, point: Point }>())
//
