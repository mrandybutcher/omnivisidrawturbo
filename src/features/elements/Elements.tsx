import React from "react";
import {useSelector} from "react-redux";
import {selectAllElementsTransformed} from "../selectors";
import Element from "./Element";

export default function Elements() {
    const items = useSelector(selectAllElementsTransformed);

    const itemElements = items.map((element) =>
        <Element key={element.id} element={element}/>
    );
    return <>{itemElements}</>

}