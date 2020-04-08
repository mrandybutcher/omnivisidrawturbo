import {AnyAction} from "redux"
import {nanoid} from "@reduxjs/toolkit"

const adjectives = [
    "Big", "Little", "Super", "Random", "Uber", "Sketchy", "Cheeky"
]

const nouns = [
    "Steve", "Kiril", "Rich", "Bart", "Cartman"
]

export function generateRandomUserName(): string {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun      = nouns[Math.floor(Math.random() * nouns.length)]
    return adjective + " " + noun;
}

const clientInstanceId = nanoid()

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

export function isMyAction(action: AnyAction): boolean {
    return action?.meta?.clientInstanceId === getClientInstanceId()
}

export function getActionClientInstanceId(action: AnyAction): string | undefined {
    return action?.meta?.clientInstanceId
}

