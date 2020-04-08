import {createReducer} from "@reduxjs/toolkit";
import {canvasMouseLeave, canvasMouseMove, canvasZoom, changeTool} from "./actions";
import {Point} from "../../lib/geometry/point";
import {isMyAction} from "../../lib/utils"

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
    zoom:      1,
    tool:      Tool.SelectionTool,
    ghostMice: {},
}

const uiReducer = createReducer(initialState as UiState, builder =>
    builder
        .addCase(canvasMouseMove, (state, action) => {
            if(isMyAction(action)) {
                state.mouse = action.payload
            } else {
                state.ghostMice[action.meta.clientInstanceId] = action.payload;
            }
        })
        .addCase(canvasMouseLeave, (state, action) => {
            if(isMyAction(action)) {
                state.mouse = undefined
            } else {
                delete state.ghostMice[action.meta.clientInstanceId]
            }
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

export function getMousePosition(state: UiState): Point | undefined {
    return state.mouse
}

export function getZoom(state: UiState): number {
    return state.zoom
}


export function getTool(state: UiState): Tool {
    return state.tool
}