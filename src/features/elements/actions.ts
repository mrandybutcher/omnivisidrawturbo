import {createAction} from "@reduxjs/toolkit";
import {withPayloadType} from "../../lib/utils";
import {AnyElement, ElementIdArray} from "../../lib/elements";
import {Point} from "../../lib/geometry/point";
import {Box} from "../../lib/geometry/box";

export const createElement = createAction("elements/createElement", withPayloadType<AnyElement>());
export const translateElement  = createAction("elements/translateElement", withPayloadType<{ elementIds: ElementIdArray, point?: Point }>());
export const scaleElement      = createAction("elements/scaleElement", withPayloadType<{ elementIds: ElementIdArray, startBox?: Box, targetBox?: Box }>());
