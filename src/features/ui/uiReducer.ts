import {createReducer} from "@reduxjs/toolkit";
import {canvasMouseLeave, canvasMouseMove, canvasZoom, changeTool} from "./actions";
import {Point} from "../../lib/geometry/point";

export enum Tool {
    SelectionTool,
    PointTool,
    PenTool
}

export interface UiState {
    readonly mouse?: Point
    readonly zoom: number
    readonly tool: Tool
}


const initialState: UiState = {
    zoom: 1,
    tool: Tool.SelectionTool
}

const uiReducer = createReducer(initialState as UiState, builder =>
    builder
        .addCase(canvasMouseMove, (state, action) => {
            state.mouse = action.payload
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

