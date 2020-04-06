import {createAction} from "@reduxjs/toolkit"
import {withPersistentPayload} from "../../lib/utils"
import {PresentUser} from "./presenceReducer"

export const updateName = createAction("presence/updateName", withPersistentPayload<string>());
export const updateUsersPresent = createAction("presence/updateUsers", withPersistentPayload<PresentUser[]>());
