import {createAction} from "@reduxjs/toolkit";
import {ElementId, ElementIdArray} from "../../lib/elements";
import {AppThunk} from "../../app/store";
import {Direction} from "../../lib/direction";
import {Point} from "../../lib/geometry/point";
import {Box} from "../../lib/geometry/box";
import {withPayloadType} from "../../lib/utils";
import {getSelectedElementIds, getSelectionDelta, getSelectionStartBox, getSelectionTargetBox} from "./selectors";
import {getBoxForElementIds} from "../elements/selectors";

export const _selectionSetItems          = createAction("selection/setItems", withPayloadType<{ elementIds: ElementIdArray, box: Box }>());
export const selectionClear              = createAction("selection/clear", withPayloadType<void>());
export const selectionTranslateDragStart = createAction("selection/translateDragStart", withPayloadType<Point>());
export const selectionTranslateDrag      = createAction("selection/translateDrag", withPayloadType<Point>());
export const _selectionTranslateDragEnd  = createAction("selection/translateDragEnd", withPayloadType<{ elementIds: ElementIdArray, point?: Point }>());
export const selectionScaleDragStart     = createAction("selection/scaleDragStart", withPayloadType<{ direction: Direction, point: Point }>());
export const selectionScaleDrag          = createAction("selection/scaleDrag", withPayloadType<{ direction: Direction, point: Point }>());
export const _selectionScaleDragEnd      = createAction("selection/scaleDragEnd", withPayloadType<{ elementIds: ElementIdArray, startBox?: Box, targetBox?: Box }>());

export const selectionSetItem = (elementId: ElementId): AppThunk => (dispatch, getState) => {
    const {elements} = getState();
    const elementIds = [elementId]
    const box        = getBoxForElementIds(elements, elementIds)

    dispatch(_selectionSetItems({elementIds, box}))
};

export const selectionAddItem = (elementId: ElementId): AppThunk => (dispatch, getState) => {
    const {selection, elements} = getState();
    const selectedIds           = getSelectedElementIds(selection)
    const elementIds            = [...selectedIds, elementId]
    const box                   = getBoxForElementIds(elements, elementIds)

    dispatch(_selectionSetItems({elementIds, box}))
};


export const selectionTranslateDragEnd = (): AppThunk => (dispatch, getState) => {
    const {selection} = getState();
    const point       = getSelectionDelta(selection);
    const elementIds  = getSelectedElementIds(selection)

    dispatch(_selectionTranslateDragEnd({elementIds, point}))
}

export const selectionScaleDragEnd = (payload: { direction: Direction, point: Point }): AppThunk => (dispatch, getState) => {
    const {selection} = getState();
    const startBox    = getSelectionStartBox(selection)
    const targetBox   = getSelectionTargetBox(selection)
    const elementIds  = getSelectedElementIds(selection)

    dispatch(_selectionScaleDragEnd({elementIds, startBox, targetBox}))
}

