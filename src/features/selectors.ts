import {AnyElement, ElementId, ElementIdArray, elementScale, elementTranslate} from "../lib/elements";
import {
    RootState,
    selectCanvasState,
    selectElementsState,
    selectSelectionDragBoxState,
    selectSelectionState,
    selectUiState
} from "../app/rootReducer";
import {Box} from "../lib/geometry/box";
import {
    getSelectedElementIds,
    getSelectedElementIdSet,
    getSelectionDelta,
    getSelectionTargetBox
} from "./selection/getters";
import {getAllElementIds, getAllElements, getElementById, getElementsByIds} from "./elements/getters";
import {getDragBox} from "./selectionDragBox/getters";
import {getCanvasSize} from "./canvas/getters";
import {createSelector} from "@reduxjs/toolkit";
import {getMousePosition, getTool, getZoom} from "./ui/getters";

export function selectAllElementsTransformed(state: RootState): (AnyElement)[] {
    // @TODO probably a more efficient way to do this
    const selectionState       = selectSelectionState(state)
    const allElements          = getAllElements(selectElementsState(state));
    const selectedElementIdSet = getSelectedElementIdSet(selectionState)
    const delta                = getSelectionDelta(state.selection);

    return allElements.map(element => {
        if (selectedElementIdSet.has(element.id)) {
            if (selectionState.state === "noselection") {
                return element;
            }
            if (selectionState.transform?.type === "translating") {
                return elementTranslate(element, delta)
            } else if (selectionState.transform?.type === "scaling") {
                const startBox  = selectionState.box;
                const targetBox = getSelectionTargetBox(selectionState)
                return elementScale(element, startBox, targetBox)
            } else {
                return element;
            }
        }
        return element
    });
}


export const selectCanvasSize = createSelector(selectCanvasState, getCanvasSize)

export const selectMousePosition = createSelector(selectUiState, getMousePosition)

export const selectAllElements = createSelector(selectElementsState, getAllElements)

export const selectAllElementIds = createSelector(selectElementsState,getAllElementIds)

export function selectElementsByIds(state: RootState, ids: ElementIdArray): AnyElement[] {
    return getElementsByIds(selectElementsState(state), ids)
}

export function selectElementById(state: RootState, id: ElementId): AnyElement | undefined {
    return getElementById(selectElementsState(state), id)

}

export function selectSelectionBox(state: RootState): Box | undefined {
    const selectionState     = selectSelectionState(state)
    const selectedElementIds = getSelectedElementIds(selectionState)
    if (selectedElementIds.length === 0) {
        return undefined
    }
    return getSelectionTargetBox(selectionState)
}

const selectSelectedElementIds = createSelector(selectSelectionState, getSelectedElementIds)

export const selectSelectedElementIdSet = createSelector(selectSelectedElementIds,
    (selectedElementIds) => new Set(selectedElementIds)
)

export const selectSelectionDragBox = createSelector(selectSelectionDragBoxState, getDragBox);

export const selectZoom = createSelector(selectUiState, getZoom)
export const selectTool = createSelector(selectUiState, getTool)

export const selectSelectedElementsTransformed = createSelector(
    [selectSelectedElementIdSet, selectAllElementsTransformed],
    (selectedElementIdSet, allElements) => allElements.filter(it => selectedElementIdSet.has(it.id))
)
