import {createAction} from "@reduxjs/toolkit";
import {Tool} from "../ui/uiReducer";
import {withLocalPayload} from "../../lib/utils"

export const canvasZoom       = createAction("ui/zoom", withLocalPayload<number>());
export const changeTool       = createAction("ui/tool", withLocalPayload<Tool>());