import React from "react"
import {useSelector} from "react-redux";
import {selectGhostMice} from "../../app/selectors";

export default function GhostMice() {
    const ghostMice = useSelector(selectGhostMice)
    return <>{ghostMice.map((it, idx) =>
        <text key={idx} x={it.point.x} y={it.point.y}>&#8601; {it.userName}</text>
    )}</>

}