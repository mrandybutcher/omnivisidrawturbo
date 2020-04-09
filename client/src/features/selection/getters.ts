import {ElementId, ElementIdArray} from "../../lib/elements";
import {Box, boxScaleDirection, boxTranslate} from "../../lib/geometry/box";
import {SelectionState} from "./selectionReducer";
import {createGhostGetters} from "../../lib/ghostState"
import {createSelector} from "@reduxjs/toolkit"
import {Point, pointSubtract} from "../../lib/geometry/point"
import {RootState} from "../../app/rootReducer"

export const selectSelectionState = (state: RootState) => state.selection

export function getSelectionTargetBox(selectionState: SelectionState): Box | undefined {
    if (selectionState.state === "noselection") {
        return undefined;
    }
    if (selectionState.selectedElementIds.length === 0) {
        return undefined
    }
    if (selectionState.transform?.type === "translating") {
        return boxTranslate(selectionState.box, getSelectionDelta(selectionState))
    }
    if (selectionState.transform?.type === "scaling") {
        return boxScaleDirection(selectionState.box, selectionState.transform.direction, getSelectionDelta(selectionState))
    }
    return selectionState.box
}


export function getSelectedElementIds(selectionState: SelectionState): ElementIdArray {
    if (selectionState.state === "noselection") {
        return []
    }
    return selectionState.selectedElementIds;
}

export function getSelectionDelta(selectionState: SelectionState): Point | undefined {
    if (selectionState.state === "noselection") {
        return undefined
    }
    if (selectionState.transform?.type === "translating" || selectionState.transform?.type === "scaling") {
        return pointSubtract(selectionState.transform.startPoint, selectionState.transform.currentPoint)
    }
    return undefined
}


export const [getMySelectedElementIds, getGhostSelectedElementIds] = createGhostGetters(
    getSelectedElementIds
)

export const [getMySelectedElementIdSet, getGhostSelectedElementIdSet] = createGhostGetters(
    (selectionState: SelectionState): Set<ElementId> => new Set(getSelectedElementIds(selectionState))
)


export const [getMySelectionDelta, getGhostSelectionDelta] = createGhostGetters(getSelectionDelta)

export const [getMySelectionStartBox, getGhostSelectionStartBox] = createGhostGetters((selectionState: SelectionState): Box | undefined => {
    if (selectionState.state === "selected" && (selectionState.transform?.type === "scaling" || selectionState.transform?.type === "translating")) {
        return selectionState.box
    }
    return undefined
})

export const [getMySelectionTargetBox, getGhostSelectionTargetBox] = createGhostGetters(getSelectionTargetBox)

export const selectSelectionBox = createSelector(selectSelectionState, getMySelectionTargetBox)
export const selectGhostSelectionBox = createSelector(selectSelectionState, getGhostSelectionTargetBox)
const selectSelectedElementIds  = createSelector(selectSelectionState, getMySelectedElementIds)

export const selectSelectedElementIdSet = createSelector(selectSelectedElementIds,
    (selectedElementIds) => new Set(selectedElementIds)
)