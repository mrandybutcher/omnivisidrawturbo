import {AnyElement, ElementId, ElementIdArray, elementScale, elementTranslate} from "../lib/elements";
import {
    RootState,
    selectCanvasState,
    selectElementsState,
    selectSelectionDragBoxState,
    selectSelectionState
} from "../app/rootReducer";
import {Point} from "../lib/geometry/point";
import {Box} from "../lib/geometry/box";
import {
    getSelectedElementIds,
    getSelectedElementIdSet,
    getSelectionDelta,
    getSelectionTargetBox
} from "./selection/selectors";
import {getAllElements, getElementById, getElementsByIds} from "./elements/selectors";
import {getDragBox} from "./selectionDragBox/selectors";
import {getCanvasSize, getMousePosition, getZoom} from "./canvas/selectors";
import {createSelector} from "@reduxjs/toolkit";

export function selectSelectedElementsTransformed(state: RootState): AnyElement[] {
    const selectionState       = selectSelectionState(state)
    const selectedElementIdSet = getSelectedElementIdSet(selectionState)
    const allElements          = selectAllElementsTransformed(state)
    return allElements.filter(it => selectedElementIdSet.has(it.id))
}

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


export function selectCanvasSize(state: RootState) {
    return getCanvasSize(selectCanvasState(state))
}

export function selectMousePosition(state: RootState): Point | undefined {
    return getMousePosition(selectCanvasState(state))
}

export const selectAllElements = createSelector(selectElementsState, getAllElements)

// export function selectAllElements(state: RootState): AnyElement[] {
//     return getAllElements(selectElementsState(state))
//
// }

export function selectAllElementIds(state: RootState): ElementIdArray {
    return selectElementsState(state).allElementIds
}

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

export const selectSelectedElementIdSet = createSelector(selectSelectedElementIds, (selectedElementIds) =>{
    return new Set(selectedElementIds)
})


export function selectSelectionDragBox(state: RootState): Box | undefined {
    return getDragBox(selectSelectionDragBoxState(state))
}

export const selectZoom = createSelector(selectCanvasState, getZoom)
