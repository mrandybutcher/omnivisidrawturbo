import {AnyAction, createReducer} from "@reduxjs/toolkit"

interface HistoryState {
    history: AnyAction[]
}

const initialHistoryState = {
    history: []
}

const historyReducer = createReducer(initialHistoryState as HistoryState, builder =>
    builder
);

export default historyReducer
