import React, {useCallback} from "react"
import {useDispatch, useSelector} from "react-redux";
import {selectZoom} from "../selectors";
import {canvasZoom} from "../canvas/actions";

export default function Toolbar() {
    const dispatch = useDispatch()
    const zoom     = useSelector(selectZoom)

    const onZoomChange = useCallback((e) => {
        dispatch(canvasZoom(e.target.value))
    }, [dispatch])

    return <span>
        Zoom: &nbsp;
        <select value={zoom} onChange={onZoomChange}>
            <option value={0.5}>50%</option>
            <option value={1}>100%</option>
            <option value={2}>200%</option>
        </select>
    </span>
}
