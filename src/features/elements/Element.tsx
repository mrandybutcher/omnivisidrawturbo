import React, {ReactEventHandler} from "react";
import {AnyElement} from "../../lib/elements";
import {pointsToSvgPoints} from "../../lib/geometry/points";

interface ElementProps {
    element: AnyElement;
    onClick: ReactEventHandler<SVGElement>
}

function onMouseDown(e: React.MouseEvent<SVGElement>) {
    e.stopPropagation()
}

export default function Element({element, onClick}: ElementProps) {
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