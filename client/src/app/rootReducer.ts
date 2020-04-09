import selectionReducer from "../features/selection/selectionReducer"
import elementsReducer from "../features/elements/elementsReducer";
import selectionDragBoxReducer from "../features/selectionDragBox/selectionDragBoxReducer";
import canvasReducer from "../features/canvas/canvasReducer";
import uiReducer from "../features/ui/uiReducer"
import {combineReducers} from "redux";
import connectionReducer from "../features/connection/connectionReducer"
import pointerReducer from "../features/pointer/pointerReducer"

const rootReducer = combineReducers({
    canvas:           canvasReducer,
    elements:         elementsReducer,
    selection:        selectionReducer,
    selectionDragBox: selectionDragBoxReducer,
    ui:               uiReducer,
    connection:       connectionReducer,
    pointer:          pointerReducer
});

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>

