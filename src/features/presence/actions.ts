import {createAction} from "@reduxjs/toolkit";
import {withPayloadType} from "../../lib/utils";

export const updateName      = createAction("presence/updateName", withPayloadType<string>());
