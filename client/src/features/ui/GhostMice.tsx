import React from "react"
import {useSelector} from "react-redux";
import {selectGhostMice} from "../../app/selectors";

export default function GhostMice() {
    const ghostMice = useSelector(selectGhostMice)
    return <>{Object.entries(ghostMice).map((it, idx) =>
        it[1].point ? <text key={idx} x={it[1].point.x} y={it[1].point.y}>&#8601; {it[1].userName}</text> : null
    )}</>

}
