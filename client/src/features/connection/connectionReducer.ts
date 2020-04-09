import {compose, createReducer} from "@reduxjs/toolkit"
import {updateConnectionStatus, updateName, updateUsersPresent} from "./actions"
import {generateRandomUserName, getClientInstanceId} from "../../lib/utils"
import {RootState} from "../../app/rootReducer"

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
export const selectConnectionState = (state: RootState) => state.connection


const getConnectionStatus = (state: ConnectionState) => state.connected
const getName             = (state: ConnectionState) => state.name
const getUsers            = (state: ConnectionState) => state.users
const getUserId           = (state: ConnectionState) => state.id

export const selectConnectionStatus = compose(getConnectionStatus, selectConnectionState)
export const selectUserName         = compose(getName, selectConnectionState)
export const selectUsers            = compose(getUsers, selectConnectionState)
export const selectUserId           = compose(getUserId, selectConnectionState)

