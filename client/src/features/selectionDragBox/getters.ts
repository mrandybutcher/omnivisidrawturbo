import {createGhostSelector, createMySelector} from "../../lib/ghostState"
import {Box} from "../../lib/geometry/box"
import {pointsToBox} from "../../lib/geometry/point"
import {DragState} from "./selectionDragBoxReducer"


function getDragBoxOrig(dragState: DragState): Box | undefined {
    if (dragState.state === "notdragging") {
        return undefined
    }
    return pointsToBox(dragState.startPoint, dragState.currentPoint)
}
export const getDragBox = createMySelector(getDragBoxOrig)

export const getGhostDragBoxes = createGhostSelector(getDragBoxOrig)