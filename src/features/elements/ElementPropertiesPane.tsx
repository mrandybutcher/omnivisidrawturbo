import React from "react"
import {Pane} from "../chrome/Pane";
import {useSelector} from "react-redux";
import {selectSelectedElementsTransformed} from "../selectors";
import {AnyElement} from "../../lib/elements";
import styles from "./ElementPropertiesPane.module.css"

function ElementProperties({element}: { element: AnyElement }) {
    if (!Array.isArray(element.geometry)) {
        return (
            <div className={styles.root}>
                <h3>{element.type}</h3>
                <p>Geometry:</p>
                <table>
                    <tbody>
                    {Object.entries(element.geometry).map(([key, value]) => {
                        return <tr key={key}>
                            <td>{key}</td>
                            <td>{value}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>);

    } else {
        return (
            <div className={styles.root}>
                <h3>{element.type}</h3>
                <p>Geometry:</p>
                <table>
                    <tbody>
                    {element.geometry.map((point, idx) => {
                        return <tr key={idx}>
                            <td>x: {point.x}</td>
                            <td>y: {point.y}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>);

    }
}


export default function ElementPropertiesPane() {
    const selectedElements = useSelector(selectSelectedElementsTransformed)
    return (
        <Pane title="Element Properties">
            {selectedElements.map((element, idx) => <ElementProperties key={idx} element={element}/>)}
        </Pane>
    )
}