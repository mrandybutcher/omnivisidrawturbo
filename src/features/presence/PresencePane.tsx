import React, {useState} from "react"
import {Pane} from "../chrome/Pane";
import {useDispatch, useSelector} from "react-redux";
import {selectUserName} from "../../app/selectors";
import {updateName} from "./actions";


export default function PresencePane() {
    const userName              = useSelector(selectUserName)
    const [newName, setNewName] = useState<string | undefined>(undefined)
    const dispatch = useDispatch()

    function onChange(e: React.FormEvent<HTMLInputElement>) {
        setNewName(e.currentTarget.value)
    }

    function onTickClick(e: React.FormEvent<HTMLButtonElement>) {
        if(newName) {
            dispatch(updateName(newName))
        }
        setNewName(undefined)
    }
    function onCrossClick(e: React.FormEvent<HTMLButtonElement>) {
        setNewName(undefined)
    }

    return <Pane title="Presence Pane">
        <label>
            Your Name:
            <input value={newName || userName} onChange={onChange}/>
        </label>
        {newName && <button onClick={onTickClick}>&#10003;</button>}
        {newName && <button onClick={onCrossClick}>&#10007;</button>}
    </Pane>

}