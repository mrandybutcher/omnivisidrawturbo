import {createAction} from "@reduxjs/toolkit";
import {withPayloadType} from "../../lib/utils";
import {User} from "./presenceReducer";

export const updateName      = createAction("presence/updateName", withPayloadType<string>());
export const updateConnected      = createAction("presence/updateConnected", withPayloadType<boolean>());
export const updateUsers = createAction("presence/updateUserList", withPayloadType<User[]>())
