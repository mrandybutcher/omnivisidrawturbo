import {createReducer} from "@reduxjs/toolkit"
import {updateConnectionStatus, updateName, updateUsersPresent} from "./actions"
import {generateRandomUserName, getClientInstanceId} from "../../lib/utils"

interface ConnectionState {
    readonly connected: boolean
    readonly id: string
    readonly name: string
    readonly users: PresentUser[]
}

export interface PresentUser {
    id: string,
    userName: string,
}

const initialConnectionState: ConnectionState = {
    connected: false,
    id:        getClientInstanceId(),
    name:      generateRandomUserName(),
    users:     []
}

const connectionReducer = createReducer(initialConnectionState, builder =>
    builder
        .addCase(updateConnectionStatus, (state, action) => {
            state.connected = action.payload
        })
        .addCase(updateName, (state, action) => {
            state.name = action.payload
        })
        .addCase(updateUsersPresent, (state, action) => {
            state.users = action.payload
        })
);

export default connectionReducer;

export function getConnectionStatus(state: ConnectionState) {
    return state.connected
}

export function getName(state: ConnectionState) {
    return state.name
}

export function getUsers(state: ConnectionState) {
    return state.users
}

export function getUserId(state: ConnectionState) {
    return state.id
}
