import {createReducer} from "@reduxjs/toolkit";
import {Point} from "../../lib/geometry/point";
import {_selectionDragBoxDragEnd, selectionDragBoxDrag, selectionDragBoxDragStart} from "./actions";


interface NotDragging {
    readonly state: "notdragging"
}

interface Dragging {
    readonly state: "dragging"
    readonly startPoint: Point
    readonly currentPoint: Point
}

export type DragState = NotDragging | Dragging
const notDragging: NotDragging = {state: "notdragging"};

function dragStateDrag(dragState: DragState, currentPoint: Point): DragState {
    if (dragState.state === "notdragging") {
        return {
            state:        "dragging",
            startPoint:   currentPoint,
            currentPoint: currentPoint,
        }
    }
    return {
        ...dragState,
        currentPoint,
    }
}

const selectionDragBoxReducer = createReducer(notDragging as DragState, builder =>
    builder
        .addCase(selectionDragBoxDragStart, (state, action) => {

            if (state.state !== "notdragging") {
                console.log("drag lag")
            }
            return dragStateDrag(notDragging, action.payload)
        })

        .addCase(selectionDragBoxDrag, (state, action) => {
            if (state.state !== "dragging") {
                console.log("drag lag 2")
            }
            return dragStateDrag(state, action.payload);
        })

        .addCase(_selectionDragBoxDragEnd, (state, action) => {
            return notDragging;
        })
);


export default selectionDragBoxReducer;

