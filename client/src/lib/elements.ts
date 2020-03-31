import {Point} from "./geometry/point";
import {Box, boxBoundingBox, boxScale, boxTranslate} from "./geometry/box";
import {Rect, rectAdd, rectScale, rectToBox} from "./geometry/rect";
import {Circle, circleScale, circleToBox, circleTranslate} from "./geometry/circle";
import {Ellipse, ellipseScale, ellipseToBox, ellipseTranslate} from "./geometry/ellipse";
import {Points, pointsAdd, pointsScale, pointsToBox} from "./geometry/points";

export type ElementId = string
export type ElementIdArray = string[]

interface WithElementId {
    readonly id: ElementId
}

interface Formatting {
    readonly stroke?: string,
    readonly fill?: string
}

interface RectElement extends WithElementId {
    readonly type: "rect",
    readonly geometry: Rect
    readonly formatting: Formatting
}

interface LineElement extends WithElementId {
    readonly type: "line",
    readonly geometry: Box
    readonly formatting: Formatting
}

interface CircleElement extends WithElementId {
    readonly type: "circle",
    readonly geometry: Circle
    readonly formatting: Formatting
}

interface EllipseElement extends WithElementId {
    readonly type: "ellipse",
    readonly geometry: Ellipse
    readonly formatting: Formatting
}

interface TextElement extends WithElementId {
    readonly type: "text"
    readonly geometry: Rect
    readonly formatting: Formatting
    readonly text: string
}
interface PolyLineElement extends WithElementId {
    readonly type: "polyline"
    readonly geometry: Points
    readonly formatting: Formatting
}

export type AnyElement = RectElement | LineElement | CircleElement | EllipseElement | TextElement | PolyLineElement

export function elementBoundingBox(element: AnyElement): Box {
    switch (element.type) {
        case "rect":
            return rectToBox(element.geometry);
        case "line":
            return element.geometry;
        case "circle":
            return circleToBox(element.geometry)
        case "ellipse":
            return ellipseToBox(element.geometry)
        case "text":
            return rectToBox(element.geometry);
        case "polyline":
            return pointsToBox(element.geometry);
    }
}

export function elementTranslate(element: AnyElement, translate?: Point): AnyElement {
    if (!translate) {
        return element
    }
    switch (element.type) {
        case "rect":
            return {...element, geometry: rectAdd(element.geometry, translate)};
        case "line":
            return {...element, geometry: boxTranslate(element.geometry, translate)};
        case "circle":
            return {...element, geometry: circleTranslate(element.geometry, translate)};
        case "ellipse":
            return {...element, geometry: ellipseTranslate(element.geometry, translate)};
        case "text":
            return {...element, geometry: rectAdd(element.geometry, translate)};
        case "polyline":
            return {...element, geometry: pointsAdd(element.geometry, translate)};
    }
}

export function elementScale(element: AnyElement, startBox?: Box, endBox?: Box): AnyElement {
    if (!startBox || !endBox) {
        return element
    }
    switch (element.type) {
        case "rect":
            return {...element, geometry: rectScale(element.geometry, startBox, endBox)};
        case "line":
            return {...element, geometry: boxScale(element.geometry, startBox, endBox)};
        case "circle":
            return {...element, geometry: circleScale(element.geometry, startBox, endBox)}
        case "ellipse":
            return {...element, geometry: ellipseScale(element.geometry, startBox, endBox)}
        case "text":
            return {...element, geometry: rectScale(element.geometry, startBox, endBox)};
        case "polyline":
            return {...element, geometry: pointsScale(element.geometry, startBox, endBox)};
    }
}

export function elementsBoundingBox(elements: AnyElement[]): Box {
    return boxBoundingBox(elements.map(elementBoundingBox));
}

