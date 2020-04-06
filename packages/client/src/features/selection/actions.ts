import {createAction} from "@reduxjs/toolkit";
import {ElementId, ElementIdArray} from "../../lib/elements";
import {AppThunk} from "../../app/store";
import {Direction} from "../../lib/direction";
import {Point} from "../../lib/geometry/point";
import {Box} from "../../lib/geometry/box";
import {getSelectedElementIds, getSelectionDelta, getSelectionStartBox, getSelectionTargetBox} from "./getters";
import {getBoxForElementIds} from "../elements/getters";
import {scaleElement, translateElement} from "../elements/actions";
import {batch} from "react-redux";
import {withLocalPayload} from "omnivisidrawturbo-shared"

export const _selectionSetItems          = createAction("selection/setItems", withLocalPayload<{ elementIds: ElementIdArray, box: Box }>());
export const selectionClear              = createAction("selection/clear", withLocalPayload<void>());
export const selectionTranslateDragStart = createAction("selection/translateDragStart", withLocalPayload<Point>());
export const selectionTranslateDrag      = createAction("selection/translateDrag", withLocalPayload<Point>());
export const _selectionTranslateDragEnd  = createAction("selection/translateDragEnd", withLocalPayload<{ elementIds: ElementIdArray, point?: Point }>());
export const selectionScaleDragStart     = createAction("selection/scaleDragStart", withLocalPayload<{ direction: Direction, point: Point }>());
export const selectionScaleDrag          = createAction("selection/scaleDrag", withLocalPayload<{ direction: Direction, point: Point }>());
export const _selectionScaleDragEnd      = createAction("selection/scaleDragEnd", withLocalPayload<{ elementIds: ElementIdArray, startBox?: Box, targetBox?: Box }>());


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

    batch(() => {
        dispatch(_selectionTranslateDragEnd({elementIds, point}))
        dispatch(translateElement({elementIds, point}))
    })
}

export const selectionScaleDragEnd = (payload: { direction: Direction, point: Point }): AppThunk => (dispatch, getState) => {
    const {selection} = getState();
    const startBox    = getSelectionStartBox(selection)
    const targetBox   = getSelectionTargetBox(selection)
    const elementIds  = getSelectedElementIds(selection)

    batch(() => {
        dispatch(_selectionScaleDragEnd({elementIds, startBox, targetBox}))
        dispatch(scaleElement({elementIds, startBox, targetBox}))
    });
}

