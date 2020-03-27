import {createAction} from "@reduxjs/toolkit";
import {withPayloadType} from "../../lib/utils";
import {AnyElement} from "../../lib/elements";

export const createElement = createAction("elements/createElement", withPayloadType<AnyElement>());