import React from "react";
import DragHandle from "./DragHandle";
import {useSelector} from "react-redux";
import {directionDragHandlesForRect} from "../../lib/direction";
import {Point} from "../../lib/geometry/point";
import {rectFromBox} from "../../lib/geometry/rect";
import {selectSelectionBox } from "../../app/selectors";
import {selectZoom} from "../ui/uiReducer"

function getPos(e: MouseEvent | React.MouseEvent<Element>): Point {
    return {
        x: e.pageX,
        y: e.pageY,
    }
}

export default function GhostSelectionBox() {
    const selectionBox = useSelector(selectSelectionBox);
    const zoom         = useSelector(selectZoom)


    // return <>{Object.entries(selectionBox).map((it, idx) =>
    const rect         = selectionBox ? rectFromBox(selectionBox) : undefined;
    if (!rect) {
        return null;
    }
    const dragHandleElements = directionDragHandlesForRect(rect, 8).map((handle) => {
        return <DragHandle key={handle.direction} handle={handle}/>
    });

    return (
        <>
            <rect fillOpacity="0" stroke="blue" x={rect.x} y={rect.y} width={rect.width} height={rect.height}
                  cursor="move"
                  strokeDasharray="5"/>
        </>
    );

}

