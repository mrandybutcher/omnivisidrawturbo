import selectionReducer from "../features/selection/selectionReducer"
import elementsReducer from "../features/elements/elementsReducer";
import selectionDragBoxReducer from "../features/selectionDragBox/selectionDragBoxReducer";
import canvasReducer from "../features/canvas/canvasReducer";
import {combineReducers} from "redux";

const rootReducer = combineReducers({
    canvas: canvasReducer,
    elements: elementsReducer,
    selection: selectionReducer,
    selectionDragBox: selectionDragBoxReducer,
});

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>

export const selectCanvasState           = (state: RootState) => state.canvas
export const selectElementsState         = (state: RootState) => state.elements
export const selectSelectionState        = (state: RootState) => state.selection
export const selectSelectionDragBoxState = (state: RootState) => state.selectionDragBox
