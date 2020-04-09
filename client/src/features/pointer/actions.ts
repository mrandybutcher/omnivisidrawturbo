import {createAction} from "@reduxjs/toolkit"
import {withTransientPayload} from "../../lib/utils"
import {Point} from "../../lib/geometry/point"

export const canvasMouseMove  = createAction("ui/mouseMove", withTransientPayload<Point>());
export const canvasMouseLeave = createAction("ui/mouseLeave", withTransientPayload<void>());