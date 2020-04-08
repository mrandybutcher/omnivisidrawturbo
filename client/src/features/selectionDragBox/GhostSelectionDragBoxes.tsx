import React from "react"
import {useSelector} from "react-redux";
import {selectGhostSelectionDragBoxes} from "../../app/selectors";
import {rectFromBox} from "../../lib/geometry/rect"

export default function GhostSelectionDragBoxes() {
    const selectionDragBoxes = useSelector(selectGhostSelectionDragBoxes);

    return <>{
        Object.entries(selectionDragBoxes).map(([id, box]) => {
            if (!box) {
                return null;
            }
            const rect = rectFromBox(box)
            return <rect key={id} fillOpacity="0" stroke="black" strokeDasharray={5} {...rect}/>
        })
    }</>
}

