import React from "react"
import {rectFromBox} from "../../lib/geometry/rect";
import {useSelector} from "react-redux";
import {selectSelectionDragBox} from "./getters"

export default function SelectionDragBox() {
    const selectionDragBox = useSelector(selectSelectionDragBox);

    if (selectionDragBox) {
        const rect = rectFromBox(selectionDragBox)
        return <rect fillOpacity="0" stroke="black" {...rect} strokeDasharray="5"/>
    } else {
        return null;
    }
}

