import {createAction} from "@reduxjs/toolkit"
import {withPersistentPayload} from "omnivisidrawturbo-shared"

export const updateName = createAction("presence/updateName", withPersistentPayload<string>());
