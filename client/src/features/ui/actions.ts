import {createAction} from "@reduxjs/toolkit";
import {Point} from "../../lib/geometry/point";
import {Tool} from "../ui/uiReducer";
import {withLocalPayload, withTransientPayload} from "../../lib/utils"

export const canvasMouseMove  = createAction("ui/mouseMove", withTransientPayload<Point>());
export const canvasMouseLeave = createAction("ui/mouseLeave", withTransientPayload<void>());
export const canvasZoom       = createAction("ui/zoom", withLocalPayload<number>());
export const changeTool       = createAction("ui/tool", withLocalPayload<Tool>());