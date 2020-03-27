import {createAction} from "@reduxjs/toolkit";
import {withPayloadType} from "../../lib/utils";
import {Point} from "../../lib/geometry/point";
import {Tool} from "../ui/uiReducer";

export const canvasMouseMove  = createAction("ui/mouseMove", withPayloadType<Point>());
export const canvasMouseLeave = createAction("ui/mouseLeave", withPayloadType<void>());
export const canvasZoom       = createAction("ui/zoom", withPayloadType<number>())
export const changeTool       = createAction("ui/tool", withPayloadType<Tool>())