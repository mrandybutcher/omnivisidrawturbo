import React from "react";
import {AnyElement} from "../../lib/elements";
import {pointsToSvgPoints} from "../../lib/geometry/points";
import useTool from "../../hooks/useTool";

export default function Element({element}: { element: AnyElement }) {
    const tool = useTool();

    const onClick     = tool.createElementMouseClick(element.id)
    const onMouseDown = tool.onElementMouseDown

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