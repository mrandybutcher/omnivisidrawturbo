import {createReducer} from "@reduxjs/toolkit";


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
}


const initialState: CanvasState = {
    canvasType: {
        type: "fixed",
        width: 10000,
        height: 10000
    },
}

const canvasReducer = createReducer(initialState as CanvasState, builder =>
    builder
)

export default canvasReducer;

