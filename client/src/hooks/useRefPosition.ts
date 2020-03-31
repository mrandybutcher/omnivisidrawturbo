import {RefObject, useCallback, useEffect, useLayoutEffect, useRef} from "react";


export interface Position {
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
    readonly top: number,
    readonly right: number,
    readonly bottom: number,
    readonly left: number
}

function getPosition(node: HTMLElement): Position {
    const rect               = node.getBoundingClientRect()
    const position: Position = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
    }
    return position;
}

type PositionChanged = (position: Position) => void


export default function useRefPosition<T extends HTMLElement>(handler: PositionChanged): [RefObject<T>] {
    const ref = useRef<T>();

    const handleResize = useCallback(() => {
        if (ref.current) {
            const position = getPosition(ref.current);
            handler(position)
        }
    }, [ref, handler])

    useLayoutEffect(handleResize, [ref, handler])

    useEffect(() => {

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [ref, handler, handleResize]); // Empty array ensures that effect is only run on mount and unmount
    return [ref as RefObject<T>]
}