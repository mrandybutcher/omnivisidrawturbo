import {createAction} from "@reduxjs/toolkit";
import {ElementId, ElementIdArray} from "../../lib/elements";
import {AppThunk} from "../../app/store";
import {Direction} from "../../lib/direction";
import {Point} from "../../lib/geometry/point";
import {Box} from "../../lib/geometry/box";
import {getMySelectedElementIds, getMySelectionDelta, getMySelectionStartBox, getMySelectionTargetBox} from "./getters";
import {scaleElement, translateElement} from "../elements/actions";
import {batch} from "react-redux";
import {withTransientPayload} from "../../lib/utils"
import {getBoxForElementIds} from "../elements/elementsReducer"

export const _selectionSetItems          = createAction("selection/setItems", withTransientPayload<{ elementIds: ElementIdArray, box: Box }>());
export const selectionClear              = createAction("selection/clear", withTransientPayload<void>());
export const selectionTranslateDragStart = createAction("selection/translateDragStart", withTransientPayload<Point>());
export const selectionTranslateDrag      = createAction("selection/translateDrag", withTransientPayload<Point>());
export const _selectionTranslateDragEnd  = createAction("selection/translateDragEnd", withTransientPayload<{ elementIds: ElementIdArray, point?: Point }>());
export const selectionScaleDragStart     = createAction("selection/scaleDragStart", withTransientPayload<{ direction: Direction, point: Point }>());
export const selectionScaleDrag          = createAction("selection/scaleDrag", withTransientPayload<{ direction: Direction, point: Point }>());
export const _selectionScaleDragEnd      = createAction("selection/scaleDragEnd", withTransientPayload<{ elementIds: ElementIdArray, startBox?: Box, targetBox?: Box }>());


export const selectionSetItem = (elementId: ElementId): AppThunk => (dispatch, getState) => {
    const {elements} = getState();
    const elementIds = [elementId]
    const box        = getBoxForElementIds(elements, elementIds)

    dispatch(_selectionSetItems({elementIds, box}))
};

export const selectionAddItem = (elementId: ElementId): AppThunk => (dispatch, getState) => {
    const {selection, elements} = getState();
    const selectedIds           = getMySelectedElementIds(selection)
    const elementIds            = [...selectedIds, elementId]
    const box                   = getBoxForElementIds(elements, elementIds)

    dispatch(_selectionSetItems({elementIds, box}))
};


export const selectionTranslateDragEnd = (): AppThunk => (dispatch, getState) => {
    const {selection} = getState();
    const point       = getMySelectionDelta(selection);
    const elementIds  = getMySelectedElementIds(selection)

    // batch(() => {
    dispatch(translateElement({elementIds, point}))
    dispatch(_selectionTranslateDragEnd({elementIds, point}))
    // })
}

export const selectionScaleDragEnd = (payload: { direction: Direction, point: Point }): AppThunk => (dispatch, getState) => {
    const {selection} = getState();
    const startBox    = getMySelectionStartBox(selection)
    const targetBox   = getMySelectionTargetBox(selection)
    const elementIds  = getMySelectedElementIds(selection)

    batch(() => {
        dispatch(_selectionScaleDragEnd({elementIds, startBox, targetBox}))
        dispatch(scaleElement({elementIds, startBox, targetBox}))
    });
}

