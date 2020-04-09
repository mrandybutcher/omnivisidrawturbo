import {createReducer} from "@reduxjs/toolkit";
import {canvasMouseLeave, canvasMouseMove} from "./actions";
import {Point} from "../../lib/geometry/point";
import {RootState} from "../../app/rootReducer"
import {createGhostReducer, getGhostState, getMyState} from "../../lib/ghostState"


export interface PointerState {
    readonly mouse?: Point
}

const initialState: PointerState = {}

const pointerReducer = createReducer(initialState as PointerState, builder =>
    builder
        .addCase(canvasMouseMove, (state, action) => {
            state.mouse = action.payload
        })
        .addCase(canvasMouseLeave, (state, action) => {
            state.mouse = undefined
        })
)


export default createGhostReducer(pointerReducer);

export const selectPointerState = (state: RootState) => state.pointer

const getMousePosition = (state: PointerState): Point | undefined => state.mouse

export const selectMousePosition   = (state: RootState) => getMousePosition(getMyState(selectPointerState(state)))
export const selectMouseGhostState = (state: RootState) => getGhostState<PointerState>(selectPointerState(state))
