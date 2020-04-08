import {createAction} from "@reduxjs/toolkit"
import {withLocalPayload, withPersistentPayload} from "../../lib/utils"
import {PresentUser} from "./connectionReducer"

export const updateConnectionStatus = createAction("connection/updateConnectionStatus", withLocalPayload<boolean>());
export const loginToSocket          = createAction("connection/loginToSocket", withPersistentPayload<{ clientInstanceId: string, userName: string }>());
export const updateName             = createAction("presence/updateName", withPersistentPayload<string>());
export const updateUsersPresent     = createAction("presence/updateUsers", withPersistentPayload<PresentUser[]>());