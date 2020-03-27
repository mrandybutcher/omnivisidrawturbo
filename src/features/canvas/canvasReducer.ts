import {createReducer} from "@reduxjs/toolkit";
import {canvasMouseLeave, canvasMouseMove, canvasZoom, changeTool} from "./actions";
import {Point} from "../../lib/geometry/point";

export enum Tool {
    SelectionTool,
    PointTool,
    PenTool
}


interface FixedCanvas {
    readonly type: "fixed"
    readonly width: number,
    readonly height: number,
}

interface InfiniteCanvas {
    readonly type: "infinite"
}

export interface CanvasState {
    readonly canvasType: FixedCanvas | InfiniteCanvas
    readonly mouse?: Point
    readonly zoom: number
    readonly tool: Tool
}


const initialState: CanvasState = {
    canvasType: {
        type: "fixed",
        width: 10000,
        height: 10000
    },
    zoom: 1,
    tool: Tool.SelectionTool
}

const canvasReducer = createReducer(initialState as CanvasState, builder =>
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

export default canvasReducer;

