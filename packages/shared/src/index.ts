import {createAction} from "@reduxjs/toolkit";
import {v4} from "uuid"


export const updateConnectionStatus = createAction("connection/updateConnectionStatus", withLocalPayload<boolean>());

const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined"

if(isBrowser) {
    console.log("running in browser")
} else {
    console.log("running on server")
}

const clientInstanceId = isBrowser ? v4() : "server";

export function getClientInstanceId(): string {
    return clientInstanceId
}

export function withLocalPayload<T>() {
    return (t: T) => ({payload: t})
}

export function withTransientPayload<T>() {
    return (t: T) => {
        return {payload: t, meta: {clientInstanceId, transient: true}}
    }
}

export function withPersistentPayload<T>() {
    return (t: T) => {
        return {payload: t, meta: {clientInstanceId, persistent: true}}
    }
}
