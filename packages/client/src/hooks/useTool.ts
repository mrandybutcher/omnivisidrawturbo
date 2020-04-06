import React, {useCallback, useState} from "react";
import {Point, pointZoom} from "../lib/geometry/point";
import {useDispatch, useSelector} from "react-redux";
import {selectTool, selectZoom} from "../app/selectors";
import {
    selectionDragBoxDrag,
    selectionDragBoxDragEnd,
    selectionDragBoxDragStart
} from "../features/selectionDragBox/actions";
import {useDrag} from "./useDrag";
import {addPointToPolyLine, createElement} from "../features/elements/actions";
import {canvasMouseLeave, canvasMouseMove, changeTool} from "../features/ui/actions";
import {Tool} from "../features/ui/uiReducer";
import {selectionAddItem, selectionSetItem} from "../features/selection/actions";
import {ElementId} from "../lib/elements";

function getPos(e: MouseEvent | React.MouseEvent<Element>): Point {
    return {
        x: e instanceof MouseEvent ? e.offsetX : e.nativeEvent.offsetX,
        y: e instanceof MouseEvent ? e.offsetY : e.nativeEvent.offsetY
    }
}

function onCanvasClick(e: MyMouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    // @TODO onMouseDown fires first anyway, and has the same effect but it lucks messier in redux actions
    // dispatch(selectionClear())
}

function createElementMouseClick(id: ElementId) {
    return (e: MyMouseEvent) => {
    }
}

type MyMouseEvent = MouseEvent | React.MouseEvent<Element, MouseEvent>

interface ToolHandler {
    readonly onCanvasMouseDown?: (e: MyMouseEvent) => void
    readonly onCanvasClick?: (e: MyMouseEvent) => void
    readonly onCanvasMouseMove?: (e: MyMouseEvent) => void
    readonly onCanvasMouseLeave?: (e: MyMouseEvent) => void
    readonly onElementMouseDown?: (e: MyMouseEvent) => void
    readonly createElementMouseClick: (id: ElementId) => (e: MyMouseEvent) => void
}

function useSelectionTool(): ToolHandler {
    const zoom     = useSelector(selectZoom)
    const dispatch = useDispatch()

    const onDragStart = useCallback((e: MyMouseEvent) => {
        dispatch(selectionDragBoxDragStart(pointZoom(getPos(e), zoom)));
    }, [dispatch, zoom]);
    const onDrag      = useCallback((e: MyMouseEvent) => {
        dispatch(selectionDragBoxDrag(pointZoom(getPos(e), zoom)));
    }, [dispatch, zoom]);
    const onDragEnd   = useCallback((e: MyMouseEvent) => {
        dispatch(selectionDragBoxDragEnd(pointZoom(getPos(e), zoom)));
    }, [dispatch, zoom]);

    const onCanvasMouseDown = useDrag({
        onDragStart, onDrag, onDragEnd
    });

    const onElementMouseDown = useCallback((e: MyMouseEvent) => {
        e.stopPropagation()
    }, []);


    const createElementMouseClick = useCallback((id: ElementId) => {
        return (e: MyMouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const action = e.shiftKey ? selectionAddItem : selectionSetItem
            dispatch(action(id));
        }
    }, [dispatch])

    return {
        onCanvasMouseDown,
        onCanvasClick,
        onElementMouseDown,
        createElementMouseClick
    }
}

function usePenTool(): ToolHandler {
    const zoom                      = useSelector(selectZoom)
    const dispatch                  = useDispatch()
    const [penToolId, setPenToolId] = useState<string | undefined>()

    const onDragStart = useCallback((e: MyMouseEvent) => {
        const id = (Math.random() * 100).toString()
        setPenToolId(id)
        return dispatch(createElement({
            id: id,
            type: "polyline",
            geometry: [pointZoom(getPos(e), zoom)],
            formatting: {stroke: "black"},
        }))
    }, [dispatch, zoom]);

    const onDrag = useCallback((e: MyMouseEvent) => {
        if (penToolId) {
            dispatch(addPointToPolyLine({elementId: penToolId, point: pointZoom(getPos(e), zoom)}));
        }
    }, [dispatch, zoom, penToolId]);

    const onDragEnd = useCallback((e: MyMouseEvent) => {
        setPenToolId(undefined)
        dispatch(changeTool(Tool.SelectionTool))
    }, [dispatch]);

    const onPenToolMouseDown = useDrag({
        onDragStart, onDrag, onDragEnd
    });
    return {
        onCanvasMouseDown: onPenToolMouseDown,
        onCanvasClick: onCanvasClick,
        createElementMouseClick
    }
}


export default function useTool(): ToolHandler {
    const tool     = useSelector(selectTool)
    const dispatch = useDispatch()
    const zoom     = useSelector(selectZoom)

    const selectionHandler = useSelectionTool()
    const penHandler       = usePenTool()

    // These two probably shouldn't be in useTool
    const onCanvasMouseMove = useCallback((e: MyMouseEvent) => {
        console.log("sending mouse move")
        dispatch(canvasMouseMove(pointZoom(getPos(e), zoom)));
    }, [dispatch, zoom]);

    const onCanvasMouseLeave = useCallback((e: MyMouseEvent) => {
        dispatch(canvasMouseLeave())
    }, [dispatch]);


    switch (tool) {
        case Tool.SelectionTool:
            return {
                ...selectionHandler,
                onCanvasMouseMove,
                onCanvasMouseLeave
            }
        case Tool.PenTool:
            return {
                ...penHandler,
                onCanvasMouseMove,
                onCanvasMouseLeave
            }
        default:
            return {
                onCanvasMouseDown: undefined,
                onCanvasClick: undefined,
                onCanvasMouseMove,
                onCanvasMouseLeave,
                createElementMouseClick
            }
    }
}