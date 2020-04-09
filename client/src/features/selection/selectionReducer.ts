import {createReducer} from "@reduxjs/toolkit";
import {
    _selectionScaleDragEnd,
    _selectionSetItems,
    _selectionTranslateDragEnd,
    selectionClear,
    selectionScaleDrag,
    selectionScaleDragStart,
    selectionTranslateDrag,
    selectionTranslateDragStart
} from "./actions";
import {ElementIdArray} from "../../lib/elements";
import {Box, boxScaleDirection, boxTranslate} from "../../lib/geometry/box";
import {Point, pointSubtract} from "../../lib/geometry/point";
import {Direction} from "../../lib/direction";
import {_selectionDragBoxDragEnd} from "../selectionDragBox/actions";
import {createGhostReducer} from "../../lib/ghostState"
import {RootState} from "../../app/rootReducer"


interface NoSelection {
    readonly state: "noselection"
}

interface Selected {
    readonly state: "selected"
    readonly selectedElementIds: ElementIdArray,
    readonly box: Box // the current selectionBox
    readonly transform?: Translating | Scaling
}

interface Translating {
    readonly type: "translating",
    readonly startPoint: Point
    readonly currentPoint: Point
}

interface Scaling {
    readonly type: "scaling"
    readonly startPoint: Point,
    readonly currentPoint: Point
    readonly direction: Direction
}

export type SelectionState = NoSelection | Selected

const noSelection: NoSelection = {state: "noselection"};

function select(selectionState: SelectionState, box: Box | undefined, selectedElementIds: ElementIdArray): SelectionState {
    if (!box) {
        return selectionState
    }
    return {
        state:     "selected",
        selectedElementIds,
        box,
        transform: undefined
    }
}

function translate(selectionState: SelectionState, currentPoint: Point): SelectionState {
    if (selectionState.state === "selected") {
        return {
            ...selectionState,
            transform: {
                type:       "translating",
                startPoint: selectionState.transform?.startPoint || currentPoint,
                currentPoint,
            }
        }
    } else {
        throw new Error("Invalid state transition to translate from " + selectionState.state)
    }
}

function scale(selectionState: SelectionState, currentPoint: Point, direction: Direction): SelectionState {
    if (selectionState.state === "selected") {
        return {
            ...selectionState,
            transform: {
                type:       "scaling",
                direction,
                startPoint: selectionState.transform?.startPoint || currentPoint,
                currentPoint,
            }
        }
    } else {
        throw new Error("Invalid state transition to scaleing from " + selectionState.state)
    }
}


const selectionReducer = createReducer(noSelection as SelectionState, builder =>
    builder
        .addCase(_selectionSetItems, (state, action) => {
            const {elementIds, box} = action.payload;
            return select(state, box, elementIds)
        })
        .addCase(selectionClear, (state, action) => {
            return noSelection;
        })
        .addCase(selectionTranslateDragStart, (state, action) => {
            const point = action.payload;

            return translate(state, point)
        })
        .addCase(selectionTranslateDrag, (state, action) => {
            const point = action.payload

            return translate(state, point)
        })
        .addCase(_selectionTranslateDragEnd, (state, action) => {
            const {elementIds} = action.payload;

            return select(state, getSelectionTargetBox(state), elementIds)
        })
        .addCase(selectionScaleDragStart, (state, action) => {
            const {point, direction} = action.payload

            return scale(state, point, direction)
        })
        .addCase(selectionScaleDrag, (state, action) => {
            const {point, direction} = action.payload

            return scale(state, point, direction)
        })
        .addCase(_selectionScaleDragEnd, (state, action) => {
            const {elementIds} = action.payload;

            return select(state, getSelectionTargetBox(state), elementIds)
        })
        .addCase(_selectionDragBoxDragEnd, (state, action) => {
            const {elementIds, box} = action.payload;

            return select(state, box, elementIds)
        })
);

export default createGhostReducer(selectionReducer);

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

export const selectSelectionState     = (state: RootState) => state.selection