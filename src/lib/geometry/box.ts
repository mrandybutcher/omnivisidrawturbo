import {Direction} from "../direction";
import {Point, pointScale} from "./point";

export interface Box {
    readonly x1: number,
    readonly y1: number,
    readonly x2: number,
    readonly y2: number,
}

export function boxTranslate(box: Box, translate?: Point): Box {
    if (!translate) {
        return box
    }
    return {
        x1: box.x1 + translate.x,
        y1: box.y1 + translate.y,
        x2: box.x2 + translate.x,
        y2: box.y2 + translate.y
    }
}


export function boxScaleDirection(box: Box, direction: Direction, point?: Point): Box {
    if (!point) {
        return box
    }
    switch (direction) {
        case Direction.top:
            return {...box, y1: box.y1 + point.y,};
        case Direction.bottom:
            return {...box, y2: box.y2 + point.y,};
        case Direction.left:
            return {...box, x1: box.x1 + point.x,};
        case Direction.right:
            return {...box, x2: box.x2 + point.x,};
        case Direction.topleft:
            return {...box, x1: box.x1 + point.x, y1: box.y1 + point.y,};
        case Direction.topright:
            return {...box, x2: box.x2 + point.x, y1: box.y1 + point.y,};
        case Direction.bottomleft:
            return {...box, x1: box.x1 + point.x, y2: box.y2 + point.y,};
        case Direction.bottomright:
            return {...box, x2: box.x2 + point.x, y2: box.y2 + point.y,}
    }
}

export function boxSubtract(fst: Box, snd: Box): Box {
    return {
        x1: fst.x1 - snd.x1,
        y1: fst.y1 - snd.y1,
        x2: fst.x2 - snd.x2,
        y2: fst.y2 - snd.y2,
    }
}

export function boxScale(box: Box, origin: Box, target: Box): Box {
    const a = pointScale({x: box.x1, y: box.y1}, origin, target)
    const b = pointScale({x: box.x2, y: box.y2}, origin, target)
    if (!a || !b) {
        return box
    }
    return {x1: a.x, y1: a.y, x2: b.x, y2: b.y}

}

export function boxBoundingBox(boxes: Box[]): Box {
    return {
        x1: Math.min(...boxes.map(box => box.x1)),
        y1: Math.min(...boxes.map(box => box.y1)),
        x2: Math.max(...boxes.map(box => box.x2)),
        y2: Math.max(...boxes.map(box => box.y2)),
    }
}

export function isBoxInBox(test: Box, outer: Box): boolean {
    return test.x1 >= outer.x1 && test.y1 >= outer.y1 && test.x2 <= outer.x2 && test.y2 <= outer.y2
}