import React from "react"
import {useSelector} from "react-redux";
import {RootState} from "../../app/rootReducer"
import {selectUsers} from "../connection/connectionReducer"
import {selectMouseGhostState} from "./pointerReducer"

export const selectGhostMice = (state: RootState) => {
    const ghostMice = selectMouseGhostState(state)
    const users     = selectUsers(state)
    return users.map(user => ({
        point:    ghostMice[user.id]?.mouse || undefined,
        userName: user.userName
    }))
}

export default function GhostMice() {
    const ghostMice = useSelector(selectGhostMice)
    return <>{Object.entries(ghostMice).map((it, idx) =>
        it[1].point ? <text key={idx} x={it[1].point.x} y={it[1].point.y}>&#8601; {it[1].userName}</text> : null
    )}</>

}
