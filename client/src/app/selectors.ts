import {AnyElement, elementScale, elementTranslate} from "../lib/elements";
import {RootState} from "./rootReducer";
import {
    getMySelectedElementIdSet,
    getMySelectionDelta,
    getMySelectionTargetBox,
    selectSelectedElementIdSet,
    selectSelectionState
} from "../features/selection/getters";
import {createSelector} from "@reduxjs/toolkit";
import {getMyState} from "../lib/ghostState"
import {SelectionState} from "../features/selection/selectionReducer"
import {getAllElements, selectElementsState} from "../features/elements/elementsReducer"

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


export const selectSelectedElementsTransformed = createSelector(
    [selectSelectedElementIdSet, selectAllElementsTransformed],
    (selectedElementIdSet, allElements) => allElements.filter(it => selectedElementIdSet.has(it.id))
)


