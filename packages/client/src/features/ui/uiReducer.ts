import {createReducer} from "@reduxjs/toolkit";
import {canvasMouseLeave, canvasMouseMove, canvasZoom, changeTool} from "./actions";
import {Point} from "../../lib/geometry/point";
import {getClientInstanceId} from "omnivisidrawturbo-shared"

export enum Tool {
    SelectionTool,
    PointTool,
    PenTool,
    ConnectionTool
}

export interface UiState {
    readonly mouse?: Point
    readonly zoom: number
    readonly tool: Tool
    readonly ghostMice: { [index: string]: Point }
}


const initialState: UiState = {
    zoom: 1,
    tool: Tool.SelectionTool,
    ghostMice:            {},
}

const uiReducer = createReducer(initialState as UiState, builder =>
    builder
        .addCase(canvasMouseMove, (state, action) => {
            if(action.meta.clientInstanceId === getClientInstanceId()) {
                state.mouse = action.payload
            } else {
            state.ghostMice[action.meta.clientInstanceId] = action.payload;
            }
        })
        .addCase(canvasMouseLeave, (state, action) => {
            state.mouse = undefined
        })
        .addCase(canvasZoom, (state, action) => {
            state.zoom = action.payload
        })
        .addCase(changeTool, (state, action) => {
            state.tool = action.payload
        })
)

export default uiReducer;

export function getGhostMice(state: UiState) {
    return state.ghostMice;
}

