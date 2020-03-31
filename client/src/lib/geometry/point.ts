import {Box} from "./box";
import {Rect} from "./rect";

export interface Point {
    readonly x: number,
    readonly y: number,
}

export function pointsToBox(a: Point, b: Point): Box {
    return {
        x1: Math.min(a.x, b.x),
        y1: Math.min(a.y, b.y),
        x2: Math.max(a.x, b.x),
        y2: Math.max(a.y, b.y)
    }
}

export function pointsToRect(a: Point, b: Point): Rect {
    const box = pointsToBox(a, b);
    return {
        x: box.x1,
        y: box.y1,
        width: box.x2 - box.x1,
        height: box.y2 - box.y1
    }
}

export function isPointInBox(test: Point, box: Box): boolean {
    return test.x >= box.x1 && test.x <= box.x2 && test.y >= box.y1 && test.y <= box.y2
}

export function pointScale(point: Point, origin: Box, target: Box): Point {
    if (!isPointInBox(point, origin)) {
        return point
    }
    // console.log("point: ", point, " origin: ", origin, " target: ", target)

    const normOrigin = {
        x: origin.x2 - origin.x1,
        y: origin.y2 - origin.y1
    }
    const normTarget = {
        x: target.x2 - target.x1,
        y: target.y2 - target.y1
    }

    // point in normOrigin 0,0
    const normPoint = {
        x: point.x - origin.x1,
        y: point.y - origin.y1
    }
    // console.log("normOrigin: ", normOrigin, " normTarget: ", normTarget, " normPoint: ", normPoint)


    // point ratio relative to 0 -> normOrigin
    const pointOriginRatio = {
        x: normOrigin.x !== 0 ? normPoint.x / normOrigin.x : 0,
        y: normOrigin.y !== 0 ? normPoint.y / normOrigin.y : 0
    }
    // console.log("pointOriginRatio", pointOriginRatio)

    // point relative to normTarget
    const newNormPoint = {
        x: normTarget.x * pointOriginRatio.x,
        y: normTarget.y * pointOriginRatio.y
    }
    // console.log("newNormPoint", newNormPoint)

    const newPoint = {
        x: Math.round(target.x1 + newNormPoint.x),
        y: Math.round(target.y1 + newNormPoint.y)
    }
    // console.log("newPoint", newPoint)
    return newPoint

}

export function pointAdd(a: Point, b: Point): Point {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    }
}

export function pointZoom(a: Point, zoom: number): Point {
    return {
        x: a.x * (1 / zoom),
        y: a.y * (1 / zoom)
    }

}

export function pointEquals(a: Point, b: Point): boolean {
    return a.x === b.x && a.y === b.y
}


export function pointSubtract(a: Point, b: Point): Point {
    return {
        x: b.x - a.x,
        y: b.y - a.y
    }
}