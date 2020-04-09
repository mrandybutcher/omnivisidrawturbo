import React from "react";
import {Direction, directionToResizeIcon} from "../../lib/direction";
import {useDrag} from "../../hooks/useDrag";
import {selectionScaleDrag, selectionScaleDragEnd, selectionScaleDragStart} from "./actions";
import {useDispatch, useSelector} from "react-redux";
import {Point, pointZoom} from "../../lib/geometry/point";
import {Rect} from "../../lib/geometry/rect";
import {selectZoom} from "../ui/uiReducer"

function getPos(e: MouseEvent | React.MouseEvent<Element>): Point {
    return {
        x: e.pageX,
        y: e.pageY,
    }
}

interface DragHandleProps {
    handle: { direction: Direction, rect: Rect }
}

export default function DragHandle({handle}: DragHandleProps) {
    const dispatch = useDispatch();
    const zoom     = useSelector(selectZoom)

    const onHandleMouseDown = useDrag({
        onDragStart(e) {
            dispatch(selectionScaleDragStart({direction: handle.direction, point: pointZoom(getPos(e), zoom)}));
        }, onDrag(e) {
            dispatch(selectionScaleDrag({direction: handle.direction, point: pointZoom(getPos(e), zoom)}));
        }, onDragEnd(e) {
            dispatch(selectionScaleDragEnd({direction: handle.direction, point: pointZoom(getPos(e), zoom)}));
        }
    });

    const cursor = directionToResizeIcon(handle.direction)

    return (<rect key={handle.direction} stroke="black" fill="white" x={handle.rect.x} y={handle.rect.y}
                  width={handle.rect.width}
                  height={handle.rect.height}
                  cursor={cursor} onMouseDown={onHandleMouseDown}/>)

}

