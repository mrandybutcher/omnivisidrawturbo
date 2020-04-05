import {Point, pointSubtract} from "../../lib/geometry/point";
import {ElementId, ElementIdArray} from "../../lib/elements";
import {Box, boxScaleDirection, boxTranslate} from "../../lib/geometry/box";
import {SelectionState} from "./selectionReducer";

export function getSelectedElementIds(selectionState: SelectionState): ElementIdArray {
    if (selectionState.state === "noselection") {
        return []
    }
    return selectionState.selectedElementIds;
}

export function getSelectedElementIdSet(selectionState: SelectionState): Set<ElementId> {
    return new Set(getSelectedElementIds(selectionState))
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

export function getSelectionStartBox(selectionState: SelectionState): Box | undefined {
    if (selectionState.state === "selected" && (selectionState.transform?.type === "scaling" || selectionState.transform?.type === "translating")) {
        return selectionState.box
    }
    return undefined
}

export function getSelectionTargetBox(selectionState: SelectionState): Box | undefined {
    if (selectionState.state === "noselection") {
        return undefined;
    }
    if (selectionState.transform?.type === "translating") {
        return boxTranslate(selectionState.box, getSelectionDelta(selectionState))
    }
    if (selectionState.transform?.type === "scaling") {
        return boxScaleDirection(selectionState.box, selectionState.transform.direction, getSelectionDelta(selectionState))
    }
    return selectionState.box
}

