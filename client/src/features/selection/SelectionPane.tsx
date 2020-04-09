import React from "react"
import {Pane} from "../chrome/Pane";
import {useSelector} from "react-redux";
import {RootState} from "../../app/rootReducer";
import {SubPane} from "../chrome/SubPane";
import {getMyState} from "../../lib/ghostState"
import {SelectionState} from "./selectionReducer"
import {selectSelectionBox} from "./getters"
import {selectSelectionDragBox} from "../selectionDragBox/getters"

function selectSelectionTransform(state: RootState) {
    const myState: SelectionState = getMyState(state.selection)
    if (myState.state === "selected") {
        return myState.transform
    } else {
        return undefined
    }
}

export function SelectionPane() {
    const dragBox      = useSelector(selectSelectionDragBox)
    const selectionBox = useSelector(selectSelectionBox)
    const transform    = useSelector(selectSelectionTransform)

    const dragBoxElement = dragBox ?
        <SubPane title="Drag Box">x1: {dragBox.x1}<br/>y1: {dragBox.y1}<br/>x2: {dragBox.x2}<br/>y2: {dragBox.y2}
        </SubPane> :
        null

    const selectionBoxElement = selectionBox ?
        <div>x1: {selectionBox.x1}<br/>y1: {selectionBox.y1}<br/>x2: {selectionBox.x2}<br/>y2: {selectionBox.y2}<br/>
        </div> :
        <div>No Selection</div>

    let transformElement = null;
    if (transform) {
        if (transform.type === "translating") {
            transformElement =
                <SubPane title="Translating">
                    <div>Start Point:<br/> x: {transform.startPoint.x}<br/>y: {transform.startPoint.y}</div>
                    <div>Current Point:<br/> x: {transform.currentPoint.x}<br/>y: {transform.currentPoint.y}</div>
                </SubPane>

        } else if (transform.type === "scaling") {
            transformElement = <SubPane title="Scaling">
                <div>Start Point:<br/> x: {transform.startPoint.x}<br/>y: {transform.startPoint.y}</div>
                <div>Current Point:<br/> x: {transform.currentPoint.x}<br/>y: {transform.currentPoint.y}</div>
                <div>Direction : {transform.direction}</div>
            </SubPane>

        }
    }

    return (
        <Pane title="Selection Pane">
            {dragBoxElement}
            <SubPane title="Selection Box">
                {selectionBoxElement}
            </SubPane>
            {transformElement}
        </Pane>
    )
}