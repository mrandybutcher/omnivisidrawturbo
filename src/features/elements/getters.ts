import {AnyElement, elementBoundingBox, ElementId, ElementIdArray, elementsBoundingBox} from "../../lib/elements";
import {Box, isBoxInBox} from "../../lib/geometry/box";
import {ElementsState} from "./elementsReducer";

export function getBoxForElementIds(state: ElementsState, ids: ElementIdArray): Box {
    return elementsBoundingBox(getElementsByIds(state, ids))
}

export function getAllElements(state: ElementsState): AnyElement[] {
    return state.allElementIds.map(id => state.elements[id])
}

export function getElementsByIds(state: ElementsState, ids: ElementIdArray): AnyElement[] {
    return ids.map(id => state.elements[id])
}

export function getElementById(state: ElementsState, id: ElementId): AnyElement | undefined {
    return state.elements[id]
}

export function getAllElementIds(state: ElementsState): ElementIdArray {
    return state.allElementIds
}

export function getElementIdsInBox(state: ElementsState, box?: Box): ElementIdArray {
    if (!box) {
        return []
    }
    const allElements = getAllElements(state)
    return allElements.filter(elementBox => isBoxInBox(elementBoundingBox(elementBox), box)).map(element => element.id)
}