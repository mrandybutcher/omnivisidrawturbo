import {Box} from "../../lib/geometry/box";
import {pointsToBox} from "../../lib/geometry/point";
import {DragState} from "./selectionDragBoxReducer";

export function getDragBox(dragState: DragState): Box | undefined {
    if (dragState.state === "notdragging") {
        return undefined
    }
    return pointsToBox(dragState.startPoint, dragState.currentPoint)
}