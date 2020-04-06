import {createAction} from "@reduxjs/toolkit"
import {withLocalPayload, withPersistentPayload} from "omnivisidrawturbo-shared"

export const updateConnectionStatus = createAction("connection/updateConnectionStatus", withLocalPayload<boolean>());
export const loginToSocket          = createAction("connection/loginToSocket", withPersistentPayload<{ clientInstanceId: string, userName: string }>());

