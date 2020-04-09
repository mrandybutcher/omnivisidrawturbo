import {AnyElement, elementScale, elementTranslate} from "../lib/elements";
import {RootState} from "./rootReducer";
import {Box} from "../lib/geometry/box";
import {
    getMySelectedElementIds,
    getMySelectedElementIdSet,
    getMySelectionDelta,
    getMySelectionTargetBox
} from "../features/selection/getters";
import {createSelector} from "@reduxjs/toolkit";
import {getDragBox, getGhostDragBoxes} from "../features/selectionDragBox/getters"
import {getMyState} from "../lib/ghostState"
import {SelectionState, selectSelectionState} from "../features/selection/selectionReducer"
import {getAllElements, selectElementsState} from "../features/elements/elementsReducer"
import {selectSelectionDragBoxState} from "../features/selectionDragBox/selectionDragBoxReducer"

export function selectAllElementsTransformed(state: RootState): (AnyElement)[] {
    // @TODO probably a more efficient way to do this
    const selectionState                   = selectSelectionState(state)
    const mySelectionState: SelectionState = getMyState(selectionState)
    const allElements                      = getAllElements(selectElementsState(state));
    const selectedElementIdSet             = getMySelectedElementIdSet(selectionState)
    const delta                            = getMySelectionDelta(state.selection);

    return allElements.map(element => {
        if (selectedElementIdSet.has(element.id)) {
            if (mySelectionState.state === "noselection") {
                return element;
            }
            if (mySelectionState.transform?.type === "translating") {
                return elementTranslate(element, delta)
            } else if (mySelectionState.transform?.type === "scaling") {
                const startBox  = mySelectionState.box;
                const targetBox = getMySelectionTargetBox(selectionState)
                return elementScale(element, startBox, targetBox)
            } else {
                return element;
            }
        }
        return element
    });
}


export function selectSelectionBox(state: RootState): Box | undefined {
    const selectionState     = selectSelectionState(state)
    const selectedElementIds = getMySelectedElementIds(selectionState)
    if (selectedElementIds.length === 0) {
        return undefined
    }
    return getMySelectionTargetBox(selectionState)
}

const selectSelectedElementIds = createSelector(selectSelectionState, getMySelectedElementIds)

export const selectSelectedElementIdSet = createSelector(selectSelectedElementIds,
    (selectedElementIds) => new Set(selectedElementIds)
)

export const selectSelectionDragBox        = createSelector(selectSelectionDragBoxState, getDragBox);
export const selectGhostSelectionDragBoxes = createSelector(selectSelectionDragBoxState, getGhostDragBoxes);


export const selectSelectedElementsTransformed = createSelector(
    [selectSelectedElementIdSet, selectAllElementsTransformed],
    (selectedElementIdSet, allElements) => allElements.filter(it => selectedElementIdSet.has(it.id))
)


