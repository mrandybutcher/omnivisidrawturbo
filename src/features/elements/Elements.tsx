import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectAllElementsTransformed} from "../selectors";
import {selectionAddItem, selectionSetItem} from "../selection/actions";
import Element from "./Element";

export default function Elements() {
    const dispatch = useDispatch();
    const items    = useSelector(selectAllElementsTransformed);

    const itemElements = items.map((element) => {
        function onElementClick(e: React.MouseEvent<SVGElement>) {
            e.preventDefault();
            e.stopPropagation();
            const action = e.shiftKey ? selectionAddItem : selectionSetItem
            dispatch(action(element.id));
        }

        return <Element key={element.id} element={element} onClick={onElementClick}/>
    });
    return <>{itemElements}</>

}