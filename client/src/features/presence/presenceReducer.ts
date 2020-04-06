import {createReducer} from "@reduxjs/toolkit"
import {generateRandomUserName, getClientInstanceId} from "../../lib/utils"
import {updateName, updateUsersPresent} from "./actions"

export interface PresentUser {
    id: string,
    userName: string,
}

interface PresenceState {
    readonly id: string
    readonly name: string
    readonly users: PresentUser[]
}


const initialPresenceState = {
    id:    getClientInstanceId(),
    name:  generateRandomUserName(),
    users: []
}
const presenceReducer      = createReducer(initialPresenceState as PresenceState, builder =>
    builder
        .addCase(updateName, (state, action) => {
            state.name = action.payload
        })
        .addCase(updateUsersPresent, (state, action) => {
            state.users = action.payload
        })

);

export default presenceReducer

export function getName(state: PresenceState) {
    return state.name
}

export function getUsers(state: PresenceState) {
    return state.users
}

export function getUserId(state: PresenceState) {
    return state.id
}
