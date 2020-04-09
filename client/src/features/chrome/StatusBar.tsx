import React from "react";
import style from "./StatusBar.module.scss"
import {useSelector} from "react-redux";
import {selectMousePosition} from "../pointer/pointerReducer"
import {selectSelectionBox} from "../selection/getters"


export default function StatusBar() {
    const mouse = useSelector(selectMousePosition)
    const selectionBox = useSelector(selectSelectionBox)

    const mouseElem = mouse && <span>Mouse: x: {mouse.x}, y: {mouse.y} </span>;
    const selectionBoxElem = selectionBox && <span>Selection: x1: {selectionBox.x1}, y1: {selectionBox.y1}, x2: {selectionBox.x2}, x2: {selectionBox.x2}</span>

    return (
        <div className={style.root}>
            {mouseElem}
            {selectionBoxElem}
        </div>
    )
}