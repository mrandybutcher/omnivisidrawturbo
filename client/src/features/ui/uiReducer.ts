import {compose, createReducer} from "@reduxjs/toolkit";
import {canvasZoom, changeTool} from "./actions";
import {RootState} from "../../app/rootReducer"

export enum Tool {
    SelectionTool,
    PointTool,
    PenTool,
    ConnectionTool
}

export interface UiState {
    readonly zoom: number
    readonly tool: Tool
}


const initialState: UiState = {
    zoom: 1,
    tool: Tool.SelectionTool,
}

const uiReducer = createReducer(initialState as UiState, builder =>
    builder
        .addCase(canvasZoom, (state, action) => {
            state.zoom = action.payload
        })
        .addCase(changeTool, (state, action) => {
            state.tool = action.payload
        })
)

export default uiReducer;

export const selectUiState = (state: RootState) => state.ui

const getZoom = (state: UiState): number => state.zoom
const getTool = (state: UiState): Tool => state.tool


export const selectZoom = compose(getZoom, selectUiState)
export const selectTool = compose(getTool, selectUiState)
