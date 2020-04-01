import {createReducer} from "@reduxjs/toolkit";
import {v4} from "uuid"
import {updateName, usersUpdated, webSocketConnectionStatus} from "./actions";

const adjectives = [
    "Big", "Little", "Super", "Random", "Uber", "Sketchy", "Cheeky"
]

const nouns = [
    "Steve", "Kiril", "Rich", "Bart", "Cartman"
]

export interface User {
    id: string,
    userName: string,
    connected: boolean
}

interface PresenceState {
    readonly id: string
    readonly name: string
    readonly connected: boolean
    readonly users: User[]
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
    users: []
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
);

export default webRtcReducer

export function getName(state: PresenceState) {
    return state.name
}
export function getConnected(state: PresenceState) {
    return state.connected
}
export function getUsers(state: PresenceState) {
    return state.users
}
export function getUserId(state: PresenceState) {
    return state.id
}

