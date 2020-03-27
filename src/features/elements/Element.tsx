import React, {useCallback} from "react";
import {AnyElement} from "../../lib/elements";
import {pointsToSvgPoints} from "../../lib/geometry/points";
import {selectionAddItem, selectionSetItem} from "../selection/actions";
import {useDispatch, useSelector} from "react-redux";
import {selectTool} from "../selectors";
import {Tool} from "../ui/uiReducer";

interface ElementProps {
    element: AnyElement;
}


export default function Element({element}: ElementProps) {
    const dispatch = useDispatch()
    const tool     = useSelector(selectTool)

    const onMouseDown = useCallback((e: React.MouseEvent<SVGElement>) => {
        if (tool === Tool.SelectionTool) {
            e.stopPropagation()
        }
    }, [tool]);

    const onClick = useCallback((e: React.MouseEvent<SVGElement>) => {
        if (tool === Tool.SelectionTool) {
            e.preventDefault();
            e.stopPropagation();
            const action = e.shiftKey ? selectionAddItem : selectionSetItem
            dispatch(action(element.id));
        }
    }, [dispatch, tool, element.id]);

    switch (element.type) {
        case "rect":
            return (<rect key={element.id} onClick={onClick} {...element.geometry} {...element.formatting}
                          onMouseDown={onMouseDown}/>);
        case "line":
            return (<line key={element.id} onClick={onClick} {...element.geometry} {...element.formatting}
                          onMouseDown={onMouseDown}/>);
        case "circle":
            return (<circle key={element.id} onClick={onClick} {...element.geometry} {...element.formatting}
                            onMouseDown={onMouseDown}/>);
        case "ellipse":
            return (<ellipse key={element.id} onClick={onClick} {...element.geometry} {...element.formatting}
                             onMouseDown={onMouseDown}/>);
        case "polyline":
            const points = pointsToSvgPoints(element.geometry)
            const fill   = element.formatting.fill ? element.formatting.fill : "none"
            return (<polyline key={element.id} onClick={onClick} points={points} fill={fill} {...element.formatting}
                              onMouseDown={onMouseDown}/>);
        case "text":
            return (
                <foreignObject key={element.id} onClick={onClick} {...element.geometry} {...element.formatting}
                               onMouseDown={onMouseDown}>
                    <div>{element.text}</div>
                </foreignObject>
            )
    }
}