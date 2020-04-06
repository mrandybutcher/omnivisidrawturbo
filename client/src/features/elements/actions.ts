import {createAction} from "@reduxjs/toolkit";
import {AnyElement, ElementId, ElementIdArray} from "../../lib/elements";
import {Point} from "../../lib/geometry/point";
import {Box} from "../../lib/geometry/box";
import {withLocalPayload} from "../../lib/utils"

export const createElement         = createAction("elements/createElement", withLocalPayload<AnyElement>(),);
export const translateElement      = createAction("elements/translateElement", withLocalPayload<{ elementIds: ElementIdArray, point?: Point }>());
export const scaleElement          = createAction("elements/scaleElement", withLocalPayload<{ elementIds: ElementIdArray, startBox?: Box, targetBox?: Box }>());
export const addPointToPolyLine    = createAction("elements/addPointToPolyLine", withLocalPayload<{ elementId: ElementId, point: Point }>())
export const updateElementGeometry = createAction("elements/updateElementGeometry", withLocalPayload<{ id: ElementId, property: string, value: number }>());

