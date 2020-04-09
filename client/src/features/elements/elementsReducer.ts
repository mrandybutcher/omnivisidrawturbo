import {compose, createReducer} from "@reduxjs/toolkit";
import {
    AnyElement,
    elementBoundingBox,
    ElementId,
    ElementIdArray,
    elementsBoundingBox,
    elementScale,
    elementTranslate
} from "../../lib/elements";
import {addPointToPolyLine, createElement, scaleElement, translateElement, updateElementGeometry} from "./actions";
import {pointEquals} from "../../lib/geometry/point";
import {RootState} from "../../app/rootReducer"
import {Box, isBoxInBox} from "../../lib/geometry/box"

export interface ElementsState {
    readonly elements: { [index: string]: AnyElement },
    readonly allElementIds: ElementIdArray,
}

const initialElementsState: ElementsState = {
    elements:      {
        "a": {
            id:         "a",
            type:       "rect",
            geometry:   {x: 100, y: 100, width: 100, height: 50},
            formatting: {stroke: "green", fill: "blue"}
        },
        "b": {
            id:         "b",
            type:       "line",
            geometry:   {x1: 200, y1: 200, x2: 300, y2: 300},
            formatting: {stroke: "green"}
        },
        "c": {
            id:         "c",
            type:       "circle",
            geometry:   {cx: 400, cy: 400, r: 100},
            formatting: {stroke: "yellow", fill: "green"}
        },
        "d": {
            id:         "d",
            type:       "ellipse",
            geometry:   {cx: 200, cy: 500, rx: 100, ry: 50},
            formatting: {stroke: "blue", fill: "red"}
        },
        "e": {
            id:         "e",
            type:       "text",
            geometry:   {x: 300, y: 100, width: 100, height: 100},
            formatting: {stroke: "black", fill: "red"},
            text:       "Some Text"
        },
        "f": {
            id:         "f",
            type:       "polyline",
            geometry:   [{x: 150, y: 250}, {x: 250, y: 275}, {x: 200, y: 300}, {x: 250, y: 325}],
            formatting: {stroke: "black"},
        },
    },
    allElementIds: ["a", "b", "c", "d", "e", "f"] as ElementIdArray
}


const elementsReducer = createReducer(initialElementsState as ElementsState, builder =>
    builder
        .addCase(translateElement, (state, action) => {
            const {elementIds, point} = action.payload;

            elementIds.forEach(elementId => {
                const element = state.elements[elementId];
                if (element) {
                    state.elements[elementId] = elementTranslate(element, point)
                }
            });

        })
        .addCase(scaleElement, (state, action) => {
            const {elementIds, startBox, targetBox} = action.payload;

            elementIds.forEach(elementId => {
                const element = state.elements[elementId];
                if (element) {
                    state.elements[elementId] = elementScale(element, startBox, targetBox)
                }
            });
        })
        .addCase(createElement, (state, action) => {
            const newElement              = action.payload
            state.elements[newElement.id] = newElement
            state.allElementIds.push(newElement.id)
        })
        .addCase(addPointToPolyLine, (state, action) => {
            const {elementId, point} = action.payload
            const polyLine           = state.elements[elementId]
            if (polyLine && polyLine.type === "polyline") {
                if (!pointEquals(polyLine.geometry[polyLine.geometry.length - 1], point)) {
                    polyLine.geometry.push(point)
                }
            }

        })
        .addCase(updateElementGeometry, (state, action) => {
            let element                               = state.elements[action.payload.id];
            // @ts-ignore
            element.geometry[action.payload.property] = action.payload.value;
        })
);

export default elementsReducer;
export const selectElementsState = (state: RootState) => state.elements


export const getBoxForElementIds = (state: ElementsState, ids: ElementIdArray): Box => elementsBoundingBox(getElementsByIds(state, ids))
export const getAllElements      = (state: ElementsState): AnyElement[] => state.allElementIds.map(id => state.elements[id])
export const getElementsByIds    = (state: ElementsState, ids: ElementIdArray): AnyElement[] => ids.map(id => state.elements[id])
export const getElementById      = (state: ElementsState, id: ElementId): AnyElement | undefined => state.elements[id]
export const getAllElementIds    = (state: ElementsState): ElementIdArray => state.allElementIds
export const getElementIdsInBox  = (state: ElementsState, box?: Box): ElementIdArray => {
    if (!box) {
        return []
    }
    const allElements = getAllElements(state)
    return allElements.filter(elementBox => isBoxInBox(elementBoundingBox(elementBox), box)).map(element => element.id)
}

// export const selectBoxForElementIds = compose(getBoxForElementIds, selectElementsState)
export const selectAllElements   = compose(getAllElements, selectElementsState)
export const selectAllElementIds = compose(getAllElementIds, selectElementsState)
// export const selectElementsByIds    = compose(getElementsByIds, selectElementsState)
