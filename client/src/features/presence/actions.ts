import {createAction} from "@reduxjs/toolkit";
import {withPayloadType} from "../../lib/utils";
import {User} from "./presenceReducer";

export const updateName      = createAction("presence/updateName", withPayloadType<string>());
export const updateConnected = createAction("presence/updateConnected", withPayloadType<boolean>());
export const updateUsers     = createAction("presence/updateUserList", withPayloadType<User[]>())
export const offerUser       = createAction("presence/offerUser", withPayloadType<string>())
export const makeOffer       = createAction("presence/makeOffer", withPayloadType<{ fromId: string, recipientId: string, offer: string }>())
export const offerReceived   = createAction("presence/offerReceived", withPayloadType<{ fromId: string, fromName: string, offer: string }>())
export const makeAnswer      = createAction("presence/makeAnswer", withPayloadType<{ fromId: string, recipientId: string, answer: string }>())
export const answerReceived   = createAction("presence/answerReceived", withPayloadType<{ fromId: string, fromName: string, answer: string }>())
