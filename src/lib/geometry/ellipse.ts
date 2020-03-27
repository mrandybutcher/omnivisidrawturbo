import {Box, boxScale} from "./box";
import {Point} from "./point";

export interface Ellipse {
    readonly cx: number,
    readonly cy: number,
    readonly rx: number
    readonly ry: number
}

export function ellipseTranslate(ellipse: Ellipse, translate: Point): Ellipse {
    return {
        ...ellipse,
        cx: ellipse.cx + translate.x,
        cy: ellipse.cy + translate.y,
    }
}

export function ellipseToBox(ellipse: Ellipse): Box {
    return {
        x1: ellipse.cx - ellipse.rx,
        y1: ellipse.cy - ellipse.ry,
        x2: ellipse.cx + ellipse.rx,
        y2: ellipse.cy + ellipse.ry
    }
}

export function ellipseFromBox(box: Box): Ellipse {
    const halfWidth  = (box.x2 - box.x1) / 2;
    const halfHeight = (box.y2 - box.y1) / 2;
    return {
        cx: box.x1 + halfWidth,
        cy: box.y1 + halfHeight,
        rx: halfWidth,
        ry: halfHeight,
    }
}

export function ellipseScale(ellipse: Ellipse, origin: Box, target: Box): Ellipse {
    return ellipseFromBox(boxScale(ellipseToBox(ellipse), origin, target))
}