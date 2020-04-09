import React from "react";
import {Pane} from "../chrome/Pane";
import {useSelector} from "react-redux";
import {selectConnectionStatus} from "./connectionReducer"

export default function ConnectionPane() {
    const status = useSelector(selectConnectionStatus)
    // const dispatch = useDispatch()


    return (
        <Pane title="Connection Pane">
            {status ? <b>Connected</b> : <b>Not connected</b>}
        </Pane>
    );

}