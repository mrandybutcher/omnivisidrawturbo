import {Point} from "../../lib/geometry/point";
import {CanvasState, Tool} from "./canvasReducer";

export function getCanvasSize(state: CanvasState): { width: 100; height: 100 } | { width: number; height: number } {
    if (state.canvasType.type === "fixed") {
        return {
            width: state.canvasType.width,
            height: state.canvasType.height
        }
    } else {
        return {
            width: 100,
            height: 100
        }
    }
}

export function getMousePosition(state: CanvasState): Point | undefined {
    return state.mouse
}
export function getZoom(state: CanvasState) : number {
    return state.zoom
}
export function getTool(state: CanvasState) : Tool {
    return state.tool
}