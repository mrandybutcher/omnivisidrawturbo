import React, {useCallback} from "react"
import {Pane} from "../chrome/Pane";
import styles from "./ElementTypesPane.module.scss"
import {useDispatch} from "react-redux";
import {createElement} from "../elements/actions";
import {v4} from "uuid";

export default function ElementTypesPane() {
    const dispatch = useDispatch()

    const elements = ["rect", "line", "circle", "ellipse", "polyline", "text"];

    const onClick = useCallback((type) => {
        switch (type) {
            case "rect":
                return dispatch(createElement({
                    id: v4(),
                    type: "rect",
                    geometry: {x: 50, y: 50, width: 100, height: 100},
                    formatting: {stroke: "green", fill: "blue"}
                }))
            case "line":
                return dispatch(createElement({
                    id: v4(),
                    type: "line",
                    geometry: {x1: 50, y1: 50, x2: 100, y2: 100},
                    formatting: {stroke: "green"}
                }))
            case "circle":
                return dispatch(createElement({
                    id: v4(),
                    type: "circle",
                    geometry: {cx: 50, cy: 50, r: 100},
                    formatting: {stroke: "yellow", fill: "green"}
                }))
            case "ellipse":
                return dispatch(createElement({
                    id: v4(),
                    type: "ellipse",
                    geometry: {cx: 200, cy: 500, rx: 100, ry: 50},
                    formatting: {stroke: "blue", fill: "red"}
                }))
            case "polyline":
                return dispatch(createElement({
                    id: v4(),
                    type: "polyline",
                    geometry: [{x: 150, y: 250}, {x: 250, y: 275}, {x: 200, y: 300}, {x: 250, y: 325}],
                    formatting: {stroke: "black"},
                }))
            case "text":
                return dispatch(createElement({
                    id: v4(),
                    type: "text",
                    geometry: {x: 40, y: 50, width: 100, height: 100},
                    formatting: {stroke: "black", fill: "red"},
                    text: "Some Text"
                }))

        }
    }, [dispatch])


    return (
        <Pane title="Element Types">
            <div className={styles.root}>
                {elements.map((element, idx) => {
                    return (<div key={idx} className={styles.element} onClick={() => onClick(element)}>
                        {element}
                    </div>)
                })}
            </div>
        </Pane>
    )
}