import {createReducer} from "@reduxjs/toolkit";
import {_selectionScaleDragEnd, _selectionTranslateDragEnd} from "../selection/actions";
import {AnyElement, ElementIdArray, elementScale, elementTranslate} from "../../lib/elements";
import {createElement, scaleElement, translateElement} from "./actions";

export interface ElementsState {
    readonly elements: { [index: string]: AnyElement },
    readonly allElementIds: ElementIdArray,
}

const initialElementsState: ElementsState = {
    elements: {
        "a": {
            id: "a",
            type: "rect",
            geometry: {x: 100, y: 100, width: 100, height: 50},
            formatting: {stroke: "green", fill: "blue"}
        },
        "b": {
            id: "b",
            type: "line",
            geometry: {x1: 200, y1: 200, x2: 300, y2: 300},
            formatting: {stroke: "green"}
        },
        "c": {
            id: "c",
            type: "circle",
            geometry: {cx: 400, cy: 400, r: 100},
            formatting: {stroke: "yellow", fill: "green"}
        },
        "d": {
            id: "d",
            type: "ellipse",
            geometry: {cx: 200, cy: 500, rx: 100, ry: 50},
            formatting: {stroke: "blue", fill: "red"}
        },
        "e": {
            id: "e",
            type: "text",
            geometry: {x: 300, y: 100, width: 100, height: 100},
            formatting: {stroke: "black", fill: "red"},
            text: "Some Text"
        },
        "f": {
            id: "f",
            type: "polyline",
            geometry: [{x: 150, y: 250}, {x: 250, y: 275}, {x: 200, y: 300}, {x: 250, y: 325}],
            formatting: {stroke: "black"},
        },
    },
    allElementIds: ["a", "b", "c", "d", "e", "f"] as ElementIdArray,
}


const elementsReducer = createReducer(initialElementsState as ElementsState, builder =>
    builder
        // .addCase(_selectionTranslateDragEnd, (state, action) => {
        .addCase(translateElement, (state, action) => {
            const {elementIds, point} = action.payload;

            elementIds.forEach(elementId => {
                const element = state.elements[elementId];
                if (element) {
                    state.elements[elementId] = elementTranslate(element, point)
                }
            });

        })
        // .addCase(_selectionScaleDragEnd, (state, action) => {
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
);

export default elementsReducer;


