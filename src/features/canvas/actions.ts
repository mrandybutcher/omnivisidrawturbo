import {createAction} from "@reduxjs/toolkit";
import {Point} from "../../lib/geometry/point";
import {withPayloadType} from "../../lib/utils";


export const canvasMouseMove  = createAction("canvas/mouseMove", withPayloadType<Point>());
export const canvasMouseLeave = createAction("canvas/mouseLeave", withPayloadType<void>());
export const canvasZoom       = createAction("canvas/zoom", withPayloadType<number>())
