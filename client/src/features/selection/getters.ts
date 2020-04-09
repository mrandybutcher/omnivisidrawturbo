import {ElementId} from "../../lib/elements";
import {Box} from "../../lib/geometry/box";
import {getSelectedElementIds, getSelectionDelta, getSelectionTargetBox, SelectionState} from "./selectionReducer";
import {createGhostSelectors} from "../../lib/ghostState"


export const [getMySelectedElementIds, getGhostSelectedElementIds] = createGhostSelectors(
    getSelectedElementIds
)

export const [getMySelectedElementIdSet, getGhostSelectedElementIdSet] = createGhostSelectors(
    (selectionState: SelectionState): Set<ElementId> => new Set(getSelectedElementIds(selectionState))
)


export const [getMySelectionDelta, getGhostSelectionDelta] = createGhostSelectors(getSelectionDelta)

export const [getMySelectionStartBox, getGhostSelectionStartBox] = createGhostSelectors((selectionState: SelectionState): Box | undefined => {
    if (selectionState.state === "selected" && (selectionState.transform?.type === "scaling" || selectionState.transform?.type === "translating")) {
        return selectionState.box
    }
    return undefined
})

export const [getMySelectionTargetBox, getGhostSelectionTargetBox] = createGhostSelectors(getSelectionTargetBox)

