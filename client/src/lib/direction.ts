import {Rect} from "./geometry/rect";

export enum Direction {
    top,
    bottom,
    left,
    right,
    topleft,
    topright,
    bottomleft,
    bottomright
}


export function directionToResizeIcon(direction: Direction): string {
    switch (direction) {
        case Direction.top:
            return "n-resize";
        case Direction.bottom:
            return "s-resize";
        case Direction.left:
            return "w-resize";
        case Direction.right:
            return "e-resize";
        case Direction.topleft:
            return "nw-resize";
        case Direction.topright:
            return "ne-resize";
        case Direction.bottomleft:
            return "sw-resize";
        case Direction.bottomright:
            return "se-resize";
    }
}


export function directionDragHandlesForRect({x, y, width, height}: Rect, size: number): { direction: Direction, rect: Rect }[] {
    const halfSize = size / 2;
    return [
        {
            direction: Direction.top,
            rect: {x: (x + width / 2) - halfSize, y: y - halfSize, width: size, height: size}
        }, {
            direction: Direction.right,
            rect: {x: (x + width) - halfSize, y: (y + height / 2) - halfSize, width: size, height: size}
        }, {
            direction: Direction.left,
            rect: {x: x - halfSize, y: (y + height / 2) - halfSize, width: size, height: size}
        }, {
            direction: Direction.bottom,
            rect: {x: (x + width / 2) - halfSize, y: y + height - halfSize, width: size, height: size}
        }, {
            direction: Direction.topleft,
            rect: {x: x - halfSize, y: y - halfSize, width: size, height: size}
        }, {
            direction: Direction.topright,
            rect: {x: (x + width) - halfSize, y: y - halfSize, width: size, height: size}
        }, {
            direction: Direction.bottomleft,
            rect: {x: x - halfSize, y: y + height - halfSize, width: size, height: size}
        }, {
            direction: Direction.bottomright,
            rect: {x: (x + width) - halfSize, y: y + height - halfSize, width: size, height: size}
        },
    ];
}

