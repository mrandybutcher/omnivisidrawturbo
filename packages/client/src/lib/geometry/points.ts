import {Point, pointAdd, pointScale} from "./point";
import {Box} from "./box";

export type Points = Point[]


export function pointsToBox(points: Points): Box {
    const xs = points.map(it => it.x)
    const ys = points.map(it => it.y)
    return {
        x1: Math.min(...xs),
        y1: Math.min(...ys),
        x2: Math.max(...xs),
        y2: Math.max(...ys)
    }
}

export function pointsAdd(points: Points, point: Point): Points {
    return points.map(it => pointAdd(it, point))
}

export function pointsScale(points: Points, origin: Box, target: Box): Points {
    return points.map(it => pointScale(it, origin, target))
}

export function pointsToSvgPoints(points: Points): string {
    return points.map(it => it.x + "," + it.y).join(" ")
}
