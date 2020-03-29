import React from "react"
import {Pane} from "../chrome/Pane";
import {useSelector} from "react-redux";
import {selectSelectedElementsTransformed} from "../selectors";
import {AnyElement} from "../../lib/elements";
import {SubPane} from "../chrome/SubPane";

function ElementGeometryProperties({element}: { element: AnyElement }) {
    return (
        <SubPane title={element.type + " Geometry"}>
            <table>
                <tbody>
                {
                    Array.isArray(element.geometry)
                        ? element.geometry.map((point, idx) => {
                            return <tr key={idx}>
                                <td>x: {point.x}</td>
                                <td>y: {point.y}</td>
                            </tr>
                        })
                        : Object.entries(element.geometry).map(([key, value]) => {
                            return <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>
                        })
                }
                </tbody>
            </table>
        </SubPane>
    );

}


export default function ElementPropertiesPane() {
    const selectedElements = useSelector(selectSelectedElementsTransformed)
    return (
        <Pane title="Element Properties">
            {selectedElements.map((element, idx) => <ElementGeometryProperties key={idx} element={element}/>)}
        </Pane>
    )
}