import React from 'react';
import {useSelector} from "react-redux";
import useTool from "../../hooks/useTool";
import {selectCanvasSize} from "./canvasReducer"
import {selectZoom} from "../ui/uiReducer"


export default function Canvas({children}: { children: React.ReactNode }) {
    const size = useSelector(selectCanvasSize)
    const zoom = useSelector(selectZoom)
    const tool = useTool()

    const zoomTransform = "scale(" + zoom + ")"

    return (
        <svg width={size.width} height={size.height} onMouseMove={tool.onCanvasMouseMove}
             onMouseLeave={tool.onCanvasMouseLeave}
             onMouseDown={tool.onCanvasMouseDown} onClick={tool.onCanvasClick}>
            <g transform={zoomTransform}>
                {children}
            </g>
        </svg>
    )
}

