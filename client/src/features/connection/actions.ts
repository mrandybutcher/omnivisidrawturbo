import {createAction} from "@reduxjs/toolkit"
import {withLocalPayload, withPersistentPayload} from "../../lib/utils"

export const updateConnectionStatus = createAction("connection/updateConnectionStatus", withLocalPayload<boolean>());
export const loginToSocket          = createAction("connection/loginToSocket", withPersistentPayload<{ clientInstanceId: string, userName: string }>());

