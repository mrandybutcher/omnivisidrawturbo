import {Box, boxScale} from "./box";
import {Point} from "./point";

export interface Rect {
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number
}

export function rectAdd(rect: Rect, translate: Point): Rect {
    return {
        ...rect,
        x: rect.x + translate.x,
        y: rect.y + translate.y,
    }
}

export function rectToBox(rect: Rect): Box {
    return {
        x1: rect.x,
        y1: rect.y,
        x2: rect.x + rect.width,
        y2: rect.y + rect.height
    }
}

export function rectFromBox(box: Box): Rect {
    return {
        x: box.x1,
        y: box.y1,
        width: box.x2 - box.x1,
        height: box.y2 - box.y1
    }
}

export function rectScale(rect: Rect, origin: Box, target: Box): Rect {
    const box = rectToBox(rect)
    return rectFromBox(boxScale(box, origin, target))
}