import React, {useCallback, useEffect, useState} from 'react'
import {usePrevious} from "./usePrevious";


export function useDrag({onDrag, onDragStart, onDragEnd}: {
    onDragStart(e: MouseEvent): void
    onDrag(e: React.MouseEvent<Element>): void
    onDragEnd(e: React.MouseEvent<Element>): void
}) {
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseMove = useCallback(
        (e) => { // this one comes from the dom
            e.preventDefault();
            e.stopPropagation();
            onDrag(e)
        },
        [onDrag]
    );

    const handleMouseUp = useCallback(
        (e) => { // this one comes straight from the dom
            document.removeEventListener('mousemove', handleMouseMove);
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false)
            onDragEnd(e);
        },
        [onDragEnd, handleMouseMove]
    );

    const handleMouseDown = useCallback(
        (e) => { // this one comes from react
            document.addEventListener('mousemove', handleMouseMove);
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
            onDragStart(e);
        },
        [onDragStart, handleMouseMove]
    );

    const prevMouseMove = usePrevious(handleMouseMove);

    useEffect(
        () => {
            document.removeEventListener('mousemove', prevMouseMove);
            if (isDragging) {
                document.addEventListener('mousemove', handleMouseMove)
            }
        },
        [prevMouseMove, handleMouseMove, isDragging]
    );

    useEffect(
        () => {
            if (isDragging) {
                document.addEventListener('mouseup', handleMouseUp)
            }
            return () => document.removeEventListener('mouseup', handleMouseUp)
        },
        [isDragging, handleMouseUp]
    );

    return handleMouseDown;
}
