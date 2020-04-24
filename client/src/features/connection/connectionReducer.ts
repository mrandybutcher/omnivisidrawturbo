import {compose, createAction, createReducer} from "@reduxjs/toolkit"
import {
    generateRandomUserName,
    getClientInstanceId,
    isMyAction,
    withLocalPayload,
    withPersistentPayload
} from "../../lib/utils"
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

export const updateConnectionStatus = createAction("connection/updateConnectionStatus", withLocalPayload<boolean>());
export const loginToSocket          = createAction("connection/loginToSocket", withPersistentPayload<{ clientInstanceId: string, userName: string }>());
export const updateName             = createAction("connection/updateName", withPersistentPayload<string>());
export const updateUsersPresent     = createAction("connection/updateUsers", withPersistentPayload<PresentUser[]>());

const connectionReducer             = createReducer(initialConnectionState, builder =>
    builder
        .addCase(updateConnectionStatus, (state, action) => {
            state.connected = action.payload
        })
        .addCase(updateName, (state, action) => {
            if(isMyAction(action)) {
                state.name = action.payload
            }
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

