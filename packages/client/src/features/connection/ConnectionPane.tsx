import React, {useState} from "react";
import {Pane} from "../chrome/Pane";
import {useDispatch, useSelector} from "react-redux";
import {selectConnectionStatus, selectUserId, selectUserName, selectUsers} from "../../app/selectors";

export default function ConnectionPane() {
    const status              = useSelector(selectConnectionStatus)
    const dispatch              = useDispatch()


    return (
        <Pane title="Connection Pane">
            {status ? <b>Connected</b> : <b>Not connected</b>}
        </Pane>
    );

}