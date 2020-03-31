import {CanvasState} from "./canvasReducer";

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

