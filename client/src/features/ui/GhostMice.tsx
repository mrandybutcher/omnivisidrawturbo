import React from "react"
import {useSelector} from "react-redux";
import {selectGhostMice} from "../../app/selectors";

export default function GhostMice() {
    const ghostMice = useSelector(selectGhostMice)
    return <>{Object.entries(ghostMice).map((it, idx) =>
        <text key={idx} x={it[1].x} y={it[1].y}>&#8601; </text>
    )}</>

}
