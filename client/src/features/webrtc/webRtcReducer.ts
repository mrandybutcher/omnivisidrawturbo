import {createReducer} from "@reduxjs/toolkit";
// import {
//     updateGhostMouse,
//     updateName,
//     userConnectionStatus,
//     userDataConnectionStatus,
//     usersUpdated,
//     webSocketConnectionStatus
// } from "./actions";
// import {Point} from "../../lib/geometry/point";
// import {getClientInstanceId} from "../../lib/utils"
//
//
// export interface User {
//     id: string,
//     userName: string,
// }
//
// interface PresenceState {
//     readonly id: string
//     readonly name: string
//     readonly connected: boolean
//     readonly users: User[]
//     readonly connectionStatus: { [index: string]: string }
//     readonly dataConnectionStatus: { [index: string]: string }
//     readonly ghostMice: { [index: string]: Point }
// }
//
//
// const initialPresenceState: PresenceState = {
//     id:                   getClientInstanceId(),
//     name:                 randomName(),
//     connected:            false,
//     users:                [],
//     connectionStatus:     {},
//     ghostMice:            {},
//     dataConnectionStatus: {}
// }
//
// const webRtcReducer = createReducer(initialPresenceState as PresenceState, builder =>
//     builder
//         .addCase(updateName, (state, action) => {
//             state.name = action.payload
//         })
//         .addCase(webSocketConnectionStatus, (state, action) => {
//             state.connected = action.payload
//         })
//         .addCase(usersUpdated, (state, action) => {
//             state.users = action.payload
//         })
//         .addCase(userConnectionStatus, (state, action) => {
//             state.connectionStatus[action.payload.recipientId] = action.payload.status;
//             // state.connectionStatus[action.payload.fromId] = action.payload.status + " from"
//         })
//         .addCase(userDataConnectionStatus, (state, action) => {
//             state.dataConnectionStatus[action.payload.recipientId] = action.payload.status;
//             // state.connectionStatus[action.payload.fromId] = action.payload.status + " from"
//         })
//         .addCase(updateGhostMouse, (state, action) => {
//             state.ghostMice[action.payload.fromId] = action.payload.point;
//         })
// );
//
// export default webRtcReducer
//
// export function getName(state: PresenceState) {
//     return state.name
// }
//
// export function getConnected(state: PresenceState) {
//     return state.connected
// }
//
// export function getUsers(state: PresenceState) {
//     return state.users.map(it => {
//         return {
//             status: state.connectionStatus[it.id],
//             ...it
//         }
//     })
// }
//
// export function getUserId(state: PresenceState) {
//     return state.id
// }
//
//
// export function getGhostMice(state: PresenceState) {
//     return Object.keys(state.ghostMice).map(key => ({
//         point:    state.ghostMice[key],
//         userName: state.users?.find(it => it.id === key)?.userName || "ghost" // TODO sort this out
//     }))
// }
