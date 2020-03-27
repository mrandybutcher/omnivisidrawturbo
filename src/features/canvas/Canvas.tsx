import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useDrag} from "../../hooks/useDrag";
import {Point, pointZoom} from "../../lib/geometry/point";
import {selectionDragBoxDrag, selectionDragBoxDragEnd, selectionDragBoxDragStart} from "../selectionDragBox/actions";
import {canvasMouseLeave, canvasMouseMove} from "./actions";
import {selectCanvasSize, selectZoom} from "../selectors";


function getPos(e: MouseEvent | React.MouseEvent<Element>): Point {
    return {
        x: e instanceof MouseEvent ? e.offsetX : e.nativeEvent.offsetX,
        y: e instanceof MouseEvent ? e.offsetY : e.nativeEvent.offsetY
    }
}


export default function Canvas({children}: { children: React.ReactNode }) {
    const size     = useSelector(selectCanvasSize)
    const zoom     = useSelector(selectZoom)
    const dispatch = useDispatch()

    let onDragStart = useCallback((e: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        dispatch(selectionDragBoxDragStart(pointZoom(getPos(e), zoom)));
    }, [dispatch, zoom]);
    let onDrag      = useCallback((e: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        dispatch(selectionDragBoxDrag(pointZoom(getPos(e), zoom)));
    }, [dispatch, zoom]);
    let onDragEnd   = useCallback((e: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        dispatch(selectionDragBoxDragEnd(pointZoom(getPos(e), zoom)));
    }, [dispatch, zoom]);

    const onMouseDown = useDrag({
        onDragStart, onDrag, onDragEnd
    });

    const onMouseMove = useCallback((e: React.MouseEvent<Element>) => {
        dispatch(canvasMouseMove(pointZoom(getPos(e), zoom)));
    }, [dispatch, zoom]);

    const onMouseLeave = useCallback((e: React.MouseEvent<Element>) => {
        dispatch(canvasMouseLeave())
    }, [dispatch]);

    const onClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // @TODO onMouseDown fires first anyway, and has the same effect but it lucks messier in redux actions
        // dispatch(selectionClear())
    }, []);

    const zoomTransform = "scale(" + zoom + ")"

    return (
        <svg width={size.width} height={size.height} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
             onMouseDown={onMouseDown} onClick={onClick}>
            <g transform={zoomTransform}>
                {children}
            </g>
        </svg>
    )
}

