import React from "react";
import {useSelector} from "react-redux";
import {rectFromBox} from "../../lib/geometry/rect";
import {selectGhostSelectionBox} from "./getters"
import {createSelector} from "@reduxjs/toolkit"
import {selectUsers} from "../connection/connectionReducer"

export const selectGhostSelectionBoxes = createSelector(selectGhostSelectionBox, selectUsers,
    (boxes, users) =>
        users.map(user => ({
            box:      boxes[user.id],
            userName: user.userName
        })))

export default function GhostSelectionBox() {
    const selectionBoxes = useSelector(selectGhostSelectionBoxes);

    return <>{
        selectionBoxes
            .map((it, idx) => {
                const rect = it.box ? rectFromBox(it.box) : undefined;
                if (!rect) {
                    return null;
                }
                return (
                    <>
                        <text x={rect.x} y={rect.y} dy="-2">{it.userName}</text>
                        <rect fillOpacity="0" stroke="pink" x={rect.x} y={rect.y} width={rect.width}
                              height={rect.height}
                              strokeDasharray="5"/>
                    </>
                );
            })
        }</>

}

