import React, {useCallback, useState}  from "react"
import {Pane} from "../chrome/Pane";
import {useSelector} from "react-redux";
import {selectSelectedElementsTransformed} from "../../app/selectors";
import {AnyElement} from "../../lib/elements";
import {SubPane} from "../chrome/SubPane";
import {useDispatch} from "react-redux";
import {updateElementGeometry} from "./actions";

function EditableGeometryProperty({element, property, value}: { element: AnyElement, property: string, value: string }) {
    const [newValue, setNewValue] = useState<string | undefined>(undefined)

    const dispatch = useDispatch()
    function onKeyDown(e: { keyCode: number }) {
        if(e.keyCode == 13) {
            return dispatch(updateElementGeometry({id: element.id, property: property, value: parseInt(newValue || value)}))
        }
    }

    function onChange(e: React.FormEvent<HTMLInputElement>) {
        setNewValue(e.currentTarget.value)
    }

    return (<input onChange={onChange} onKeyDown={onKeyDown} value={newValue || value}/>)
}

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
                                <td><EditableGeometryProperty element={element} property={key} value={value} /></td>
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