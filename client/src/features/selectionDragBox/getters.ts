import {createGhostGetters} from "../../lib/ghostState"
import {Box} from "../../lib/geometry/box"
import {pointsToBox} from "../../lib/geometry/point"
import {DragState} from "./selectionDragBoxReducer"
import {createSelector} from "@reduxjs/toolkit"
import {RootState} from "../../app/rootReducer"

export const selectSelectionDragBoxState = (state: RootState) => state.selectionDragBox
export const [getDragBox, getGhostDragBoxes] = createGhostGetters((dragState: DragState): Box | undefined => {
    if (dragState.state === "notdragging") {
        return undefined
    }
    return pointsToBox(dragState.startPoint, dragState.currentPoint)
})
export const selectSelectionDragBox          = createSelector(selectSelectionDragBoxState, getDragBox);
export const selectGhostSelectionDragBoxes   = createSelector(selectSelectionDragBoxState, getGhostDragBoxes);