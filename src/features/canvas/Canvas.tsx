import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useDrag} from "../../hooks/useDrag";
import {Point, pointZoom} from "../../lib/geometry/point";
import {selectionDragBoxDrag, selectionDragBoxDragEnd, selectionDragBoxDragStart} from "../selectionDragBox/actions";
import {canvasMouseLeave, canvasMouseMove, changeTool} from "./actions";
import {selectCanvasSize, selectTool, selectZoom} from "../selectors";
import {Tool} from "./canvasReducer";
import {addPointToPolyLine, createElement} from "../elements/actions";


function getPos(e: MouseEvent | React.MouseEvent<Element>): Point {
    return {
        x: e instanceof MouseEvent ? e.offsetX : e.nativeEvent.offsetX,
        y: e instanceof MouseEvent ? e.offsetY : e.nativeEvent.offsetY
    }
}


export default function Canvas({children}: { children: React.ReactNode }) {
    const size     = useSelector(selectCanvasSize)
    const zoom     = useSelector(selectZoom)
    const tool = useSelector(selectTool)
    const dispatch = useDispatch()
    const [penToolId, setPenToolId] = useState<string | undefined>()

    let onSelectDragStart = useCallback((e: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        dispatch(selectionDragBoxDragStart(pointZoom(getPos(e), zoom)));
    }, [dispatch, zoom]);
    let onSelectDrag      = useCallback((e: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        dispatch(selectionDragBoxDrag(pointZoom(getPos(e), zoom)));
    }, [dispatch, zoom]);
    let onSelectDragEnd   = useCallback((e: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        dispatch(selectionDragBoxDragEnd(pointZoom(getPos(e), zoom)));
    }, [dispatch, zoom]);

    const onSelectToolMouseDown = useDrag({
        onDragStart: onSelectDragStart, onDrag: onSelectDrag, onDragEnd: onSelectDragEnd
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

    let onPenDragStart = useCallback((e: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        const id = (Math.random() * 100).toString()
        setPenToolId(id)
        return dispatch(createElement({
            id: id,
            type: "polyline",
            geometry: [pointZoom(getPos(e), zoom)],
            formatting: {stroke: "black"},
        }))
    }, [dispatch, zoom]);
    let onPenDrag      = useCallback((e: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        if(penToolId){
            dispatch(addPointToPolyLine({elementId: penToolId, point: pointZoom(getPos(e), zoom)}));
        }
    }, [dispatch, zoom, penToolId]);
    let onPenDragEnd   = useCallback((e: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        setPenToolId(undefined)
        dispatch(changeTool(Tool.SelectionTool))
    }, [dispatch]);

    const onPenToolMouseDown = useDrag({
        onDragStart: onPenDragStart, onDrag: onPenDrag, onDragEnd: onPenDragEnd
    });

    let onMouseDown = undefined;
    switch (tool) {
        case Tool.SelectionTool:
            onMouseDown = onSelectToolMouseDown
            break;
        case Tool.PenTool:
            onMouseDown = onPenToolMouseDown
    }


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

