import React from "react";
import DragHandle from "./DragHandle";
import {useDispatch, useSelector} from "react-redux";
import {useDrag} from "../../hooks/useDrag";
import {selectionTranslateDrag, selectionTranslateDragEnd, selectionTranslateDragStart} from "./actions";
import {directionDragHandlesForRect} from "../../lib/direction";
import {Point, pointZoom} from "../../lib/geometry/point";
import {rectFromBox} from "../../lib/geometry/rect";
import {selectSelectionBox, selectZoom} from "../selectors";

function getPos(e: MouseEvent | React.MouseEvent<Element>): Point {
    return {
        x: e.pageX,
        y: e.pageY,
    }
}

export default function SelectionBox() {
    const dispatch     = useDispatch();
    const selectionBox = useSelector(selectSelectionBox);
    const rect         = selectionBox ? rectFromBox(selectionBox) : undefined;
    const zoom         = useSelector(selectZoom)

    const onSelectionMouseDown = useDrag({
        onDragStart(e) {
            dispatch(selectionTranslateDragStart(pointZoom(getPos(e), zoom)));
        }, onDrag(e) {
            dispatch(selectionTranslateDrag(pointZoom(getPos(e), zoom)));
        }, onDragEnd(e) {
            dispatch(selectionTranslateDragEnd());
        }
    });


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
                  strokeDasharray="5" onMouseDown={onSelectionMouseDown}/>
            <>{dragHandleElements}</>
        </>
    );

}

