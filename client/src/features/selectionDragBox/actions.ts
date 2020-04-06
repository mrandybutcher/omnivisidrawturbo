import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../app/store";
import {Point} from "../../lib/geometry/point";
import {ElementIdArray} from "../../lib/elements";
import {Box} from "../../lib/geometry/box";
import {getBoxForElementIds, getElementIdsInBox} from "../elements/getters";
import {getDragBox} from "./getters";
import {withLocalPayload} from "../../lib/utils"


export const selectionDragBoxDragStart = createAction("selectionDragBox/dragBoxDragStart", withLocalPayload<Point>());
export const selectionDragBoxDrag      = createAction("selectionDragBox/dragBoxDrag", withLocalPayload<Point>());
export const _selectionDragBoxDragEnd  = createAction("selectionDragBox/dragBoxDragEnd", withLocalPayload<{ elementIds: ElementIdArray, box: Box }>());
export const selectionDragBoxDragEnd   = (point: Point): AppThunk => (dispatch, getState) => {
    const {selectionDragBox, elements} = getState();
    const draggedBox                   = getDragBox(selectionDragBox);
    const elementIds                   = getElementIdsInBox(elements, draggedBox);
    const box                          = getBoxForElementIds(elements, elementIds)

    dispatch(_selectionDragBoxDragEnd({elementIds, box}))
};