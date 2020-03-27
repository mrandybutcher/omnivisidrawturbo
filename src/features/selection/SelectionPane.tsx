import React from "react"
import {Pane} from "../chrome/Pane";
import {useSelector} from "react-redux";
import {selectSelectionBox, selectSelectionDragBox} from "../selectors";
import {RootState} from "../../app/rootReducer";

function selectSelectionTransform(state: RootState) {
    if (state.selection.state === "selected") {
        return state.selection.transform
    } else {
        return undefined
    }
}

export function SelectionPane() {
    const dragBox      = useSelector(selectSelectionDragBox)
    const selectionBox = useSelector(selectSelectionBox)
    const transform    = useSelector(selectSelectionTransform)

    const dragBoxElement = dragBox ?
        <div>x1: {dragBox.x1}<br/>y1: {dragBox.y1}<br/>x2: {dragBox.x2}<br/>y2: {dragBox.y2}<br/></div> :
        <div>Not Dragging</div>

    const selectionBoxElement = selectionBox ?
        <div>x1: {selectionBox.x1}<br/>y1: {selectionBox.y1}<br/>x2: {selectionBox.x2}<br/>y2: {selectionBox.y2}<br/>
        </div> :
        <div>No Selection</div>

    let transformElement = null;
    if (transform) {
        if (transform.type === "translating") {
            transformElement = <>
                <h4>Translating</h4>
                <div>Start Point:<br/> x: {transform.startPoint.x}<br/>y: {transform.startPoint.y}</div>
                <div>Current Point:<br/> x: {transform.currentPoint.x}<br/>y: {transform.currentPoint.y}</div>
            </>

        } else if (transform.type === "scaling") {
            transformElement = <>
                <h4>Scaling</h4>
                <div>Start Point:<br/> x: {transform.startPoint.x}<br/>y: {transform.startPoint.y}</div>
                <div>Current Point:<br/> x: {transform.currentPoint.x}<br/>y: {transform.currentPoint.y}</div>
                <div>Direction : {transform.direction}</div>
            </>

        }
    }

    return (
        <Pane title="Selection Box">
            <h4>DragBox</h4>
            {dragBoxElement}
            <h4>SelectionBox</h4>
            {selectionBoxElement}
            {transformElement}
        </Pane>
    )
}