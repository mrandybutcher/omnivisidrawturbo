import {createReducer} from "@reduxjs/toolkit"
import {updateConnectionStatus} from "./actions"

interface ConnectionState {
    readonly connected: boolean

}

const initialConnectionState: ConnectionState = {
    connected: false
}

const connectionReducer = createReducer(initialConnectionState, builder =>
    builder
        .addCase(updateConnectionStatus, (state, action) => {
            state.connected = action.payload
        })
);

export default connectionReducer;

export function getConnectionStatus(state: ConnectionState) {
    return state.connected
}