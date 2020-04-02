import {createAction} from "@reduxjs/toolkit";
import {withPayloadType} from "../../lib/utils";
import {User} from "./webRtcReducer";
import {Point} from "../../lib/geometry/point";

export const updateName                = createAction("webrtc/updateName", withPayloadType<string>());
export const webSocketConnectionStatus = createAction("webrtc/webSocketConnectionStatus", withPayloadType<boolean>());
export const userConnectionStatus      = createAction("webrtc/userConnectionStatus", withPayloadType<{ id: string, status: boolean }>())


// sending side
export const connectToUser  = createAction("webrtc/signalling/connectToUser", withPayloadType<{ recipientId: string }>())
export const offerUser      = createAction("webrtc/signalling/offerUser", withPayloadType<{ recipientId: string }>())
export const sendOffer      = createAction("webrtc/signalling/sendOffer", withPayloadType<{ fromId: string, recipientId: string, offer: string }>())
export const answerReceived = createAction("webrtc/signalling/answerReceived", withPayloadType<{ fromId: string, fromName: string, answer: string }>())


// receiving side
export const offerReceived = createAction("webrtc/signalling/offerReceived", withPayloadType<{ fromId: string, fromName: string, offer: string }>())
export const sendAnswer    = createAction("webtrc/signalling/sendAnswer", withPayloadType<{ fromId: string, recipientId: string, answer: string }>())

// common to both sides
export const sendCandidate     = createAction("webrtc/signalling/sendCandidate", withPayloadType<{ fromId: string, recipientId: string, candidate: string }>())
export const candidateReceived = createAction("webrtc/signalling/candidateReceived", withPayloadType<{ fromId: string, fromName: string, candidate: string }>())
export const usersUpdated      = createAction("webrtc/signalling/usersUpdated", withPayloadType<User[]>())


// actions over data channel
export const updateGhostMouse = createAction("webrtc/data/updateGhostMouse", withPayloadType<{fromId: string, point: Point}>())

