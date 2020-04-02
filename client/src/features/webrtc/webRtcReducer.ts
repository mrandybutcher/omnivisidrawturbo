import {createReducer} from "@reduxjs/toolkit";
import {v4} from "uuid"
import {updateName, userConnectionStatus, usersUpdated, webSocketConnectionStatus} from "./actions";

const adjectives = [
    "Big", "Little", "Super", "Random", "Uber", "Sketchy", "Cheeky"
]

const nouns = [
    "Steve", "Kiril", "Rich", "Bart", "Cartman"
]

export interface User {
    id: string,
    userName: string,
}

interface PresenceState {
    readonly id: string
    readonly name: string
    readonly connected: boolean
    readonly users: User[]
    connectionStatus: {[index: string] : string}
}

function randomName(): string {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun      = nouns[Math.floor(Math.random() * nouns.length)]
    return adjective + " " + noun;
}

const initialPresenceState: PresenceState = {
    id: v4(),
    name: randomName(),
    connected: false,
    users: [],
    connectionStatus: {}
}

const webRtcReducer = createReducer(initialPresenceState as PresenceState, builder =>
    builder
        .addCase(updateName, (state, action) => {
            state.name = action.payload
        })
        .addCase(webSocketConnectionStatus, (state, action) => {
            state.connected = action.payload
        })
        .addCase(usersUpdated, (state, action) => {
            state.users = action.payload
        })
        .addCase(userConnectionStatus, (state, action) => {
            state.connectionStatus[action.payload.recipientId] = action.payload.status ;
            // state.connectionStatus[action.payload.fromId] = action.payload.status + " from"
        })
);

export default webRtcReducer

export function getName(state: PresenceState) {
    return state.name
}
export function getConnected(state: PresenceState) {
    return state.connected
}
export function getUsers(state: PresenceState) {
    return state.users.map(it => {
        return {
            status: state.connectionStatus[it.id],
            ...it
        }
    })
}
export function getUserId(state: PresenceState) {
    return state.id
}

