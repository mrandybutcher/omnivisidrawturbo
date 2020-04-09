import React, {useCallback} from "react"
import {useDispatch, useSelector} from "react-redux";
import styles from "./Toolbar.module.scss"
import {selectTool, selectZoom, Tool} from "../ui/uiReducer";
import {canvasZoom, changeTool} from "../ui/actions";

export default function Toolbar() {
    const dispatch = useDispatch()
    const zoom     = useSelector(selectZoom)
    const tool     = useSelector(selectTool)

    const onSelectionTool  = useCallback((e) => {
        dispatch(changeTool(Tool.SelectionTool))
    }, [dispatch])
    const onPointTool      = useCallback((e) => {
        dispatch(changeTool(Tool.PointTool))
    }, [dispatch])
    const onPenTool        = useCallback((e) => {
        dispatch(changeTool(Tool.PenTool))
    }, [dispatch])
    const onConnectionTool = useCallback((e) => {
        dispatch(changeTool(Tool.ConnectionTool))
    }, [dispatch])


    const onZoomChange = useCallback((e) => {
        dispatch(canvasZoom(e.target.value))
    }, [dispatch])

    return <div className={styles.root}>
        <span> Zoom: &nbsp;
            <select value={zoom} onChange={onZoomChange}>
            <option value={0.5}>50%</option>
            <option value={1}>100%</option>
            <option value={2}>200%</option>
        </select>
        </span><span> Current Tool: &nbsp;
        <button className={tool === Tool.SelectionTool ? styles.selectedTool : ""}
                onClick={onSelectionTool}>Selection</button>
        {/*<button className={tool === Tool.PointTool ? styles.selectedTool : ""} onClick={onPointTool}>Point</button>*/}
        <button className={tool === Tool.PenTool ? styles.selectedTool : ""} onClick={onPenTool}>Pen</button>
        {/*<button className={tool === Tool.ConnectionTool ? styles.selectedTool : ""}*/}
        {/*        onClick={onConnectionTool}>Connection</button>*/}
        </span>
    </div>
}
