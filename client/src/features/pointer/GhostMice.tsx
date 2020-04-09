import React from "react"
import {useSelector} from "react-redux";
import {selectUsers} from "../connection/connectionReducer"
import {selectMouseGhostPositions} from "./pointerReducer"
import {createSelector} from "@reduxjs/toolkit"


export const selectGhostMice = createSelector(selectMouseGhostPositions, selectUsers,
    (ghostMice, users) =>
        users.map(user => ({
            point:    ghostMice[user.id],
            userName: user.userName
        })))

export default function GhostMice() {
    const ghostMice = useSelector(selectGhostMice)
    return <>{Object.entries(ghostMice).map((it, idx) =>
        it[1].point ? <text key={idx} x={it[1].point.x} y={it[1].point.y}>&#8601; {it[1].userName}</text> : null
    )}</>

}
