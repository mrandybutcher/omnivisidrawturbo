import React, {useCallback} from "react"
import {Pane} from "../chrome/Pane";
import {useDispatch, useSelector} from "react-redux";
import styles from "./ElementListPane.module.scss"
import {ElementId} from "../../lib/elements";
import {selectionAddItem, selectionSetItem} from "../selection/actions";
import {selectSelectedElementIdSet} from "../../app/selectors";
import {createSelector} from "@reduxjs/toolkit";
import {selectAllElements} from "./elementsReducer"


const selectElementListPaneData = createSelector(
    [selectSelectedElementIdSet, selectAllElements],
    (selectedIdSet, allElements) => {
        return allElements.map(element => {
            return {
                id: element.id,
                type: element.type,
                selected: selectedIdSet.has(element.id)
            }
        })

    }
)


export default function ElementListPane() {
    const allElementsInterestingData = useSelector(selectElementListPaneData)

    return <Pane title="Element List">
        <ul className={styles.root}>
            {allElementsInterestingData.map((element, idx) =>
                <ElementListPaneItem key={idx} element={element}/>
            )}
        </ul>
    </Pane>
}

function ElementListPaneItem({element}: { element: { id: ElementId, type: string, selected: boolean } }) {
    const dispatch = useDispatch()

    const onClick = useCallback((e: React.MouseEvent<Element>) => {
        e.preventDefault()
        e.stopPropagation()
        const action = e.shiftKey ? selectionAddItem : selectionSetItem
        dispatch(action(element.id))
    }, [dispatch, element])

    return <li key={element.id} className={element.selected ? styles.selected : ""}
               onClick={onClick}>{element.type}</li>
}

