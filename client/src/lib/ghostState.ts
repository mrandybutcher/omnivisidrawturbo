import {getActionClientInstanceId, isMyAction} from "./utils"
import {AnyAction} from "redux"
import {createNextState} from "@reduxjs/toolkit"

interface GhostState<S> {
    readonly myState: S
    readonly ghostState: { [index: string]: S }
}


export function createGhostReducer<S, A extends AnyAction>(reducer: (state: S | undefined, action: A) => S): (state: GhostState<S>, action: A) => GhostState<S> {
    return createNextState((state, action) => {
        const actionClientInstanceId = getActionClientInstanceId(action)
        if(state === undefined) {
            return {
                myState:    reducer(undefined, action),
                ghostState:  {}
            }
        } else if (isMyAction(action) || !actionClientInstanceId) {
            state.myState = reducer(state.myState, action)
        } else {
            state.ghostState[actionClientInstanceId] = reducer(state.ghostState[actionClientInstanceId], action)
        }
    })
}

export function createMySelector<S, R>(selector: (state: S) => R): (state: GhostState<S>) => R {
    return (state: GhostState<S>): R => selector(state?.myState as S)
}

export function createGhostSelector<S, R>(selector: (state: S) => R): (state: GhostState<S>) => { [index: string]: R } {
    return (state: GhostState<S>): { [index: string]: R } => {
        return Object.fromEntries(Object.entries(state.ghostState).map(([id, ghostState]) => {
            return [id, selector(ghostState)]
        }))
    }
}
