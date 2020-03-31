import {Box, boxScale} from "./box";
import {Point} from "./point";

export interface Circle {
    readonly cx: number,
    readonly cy: number,
    readonly r: number
}

export function circleTranslate(circle: Circle, translate: Point): Circle {
    return {
        ...circle,
        cx: circle.cx + translate.x,
        cy: circle.cy + translate.y,
    }
}

export function circleToBox(circle: Circle): Box {
    return {
        x1: circle.cx - circle.r,
        y1: circle.cy - circle.r,
        x2: circle.cx + circle.r,
        y2: circle.cy + circle.r
    }
}
export function circleFromBox(box: Box) : Circle {
    const halfWidth = (box.x2 - box.x1)/2;
    const halfHeight = (box.y2 - box.y1)/2;
    return {
        cx: box.x1 + halfWidth,
        cy: box.y1 + halfHeight,
        r: Math.min(halfWidth, halfHeight)
    }
}

export function circleScale(circle: Circle, origin: Box, target: Box): Circle {
    return circleFromBox(boxScale(circleToBox(circle), origin, target))
}