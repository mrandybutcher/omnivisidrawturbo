import {Point} from "../../lib/geometry/point";
import {Tool, UiState} from "./uiReducer";

export function getMousePosition(state: UiState): Point | undefined {
    return state.mouse
}

export function getZoom(state: UiState): number {
    return state.zoom
}

export function getTool(state: UiState): Tool {
    return state.tool
}