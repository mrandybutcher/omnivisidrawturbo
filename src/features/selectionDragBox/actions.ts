import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../app/store";
import {Point} from "../../lib/geometry/point";
import {ElementIdArray} from "../../lib/elements";
import {Box} from "../../lib/geometry/box";
import {withPayloadType} from "../../lib/utils";
import {getBoxForElementIds, getElementIdsInBox} from "../elements/getters";
import {getDragBox} from "./getters";


export const selectionDragBoxDragStart = createAction("selectionDragBox/dragBoxDragStart", withPayloadType<Point>());
export const selectionDragBoxDrag      = createAction("selectionDragBox/dragBoxDrag", withPayloadType<Point>());
export const _selectionDragBoxDragEnd  = createAction("selectionDragBox/dragBoxDragEnd", withPayloadType<{ elementIds: ElementIdArray, box: Box }>());
export const selectionDragBoxDragEnd   = (point: Point): AppThunk => (dispatch, getState) => {
    const {selectionDragBox, elements} = getState();
    const draggedBox                   = getDragBox(selectionDragBox);
    const elementIds                   = getElementIdsInBox(elements, draggedBox);
    const box                          = getBoxForElementIds(elements, elementIds)

    dispatch(_selectionDragBoxDragEnd({elementIds, box}))
};