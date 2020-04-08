import {createAction} from "@reduxjs/toolkit";
import {AnyElement, ElementId, ElementIdArray} from "../../lib/elements";
import {Point} from "../../lib/geometry/point";
import {Box} from "../../lib/geometry/box";
import {withPersistentPayload} from "../../lib/utils"

export const createElement         = createAction("elements/createElement", withPersistentPayload<AnyElement>(),);
export const translateElement      = createAction("elements/translateElement", withPersistentPayload<{ elementIds: ElementIdArray, point?: Point }>());
export const scaleElement          = createAction("elements/scaleElement", withPersistentPayload<{ elementIds: ElementIdArray, startBox?: Box, targetBox?: Box }>());
export const addPointToPolyLine    = createAction("elements/addPointToPolyLine", withPersistentPayload<{ elementId: ElementId, point: Point }>())
export const updateElementGeometry = createAction("elements/updateElementGeometry", withPersistentPayload<{ id: ElementId, property: string, value: number }>());

