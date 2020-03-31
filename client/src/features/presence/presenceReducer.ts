import {createReducer} from "@reduxjs/toolkit";
import {updateName} from "./actions";

const adjectives = [
    "Big", "Little", "Super", "Random", "Uber", "Sketchy", "Cheeky"
]

const nouns = [
    "Steve", "Kiril", "Rich", "Bart", "Cartman"
]

interface PresenceState {
    readonly name: string
}

function randomName(): string {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun      = nouns[Math.floor(Math.random() * nouns.length)]
    return adjective + " " + noun;
}

const initialPresenceState: PresenceState = {
    name: randomName()

}

const presenceReducer = createReducer(initialPresenceState as PresenceState, builder =>
    builder
        .addCase(updateName, (state, action) => {
            state.name = action.payload
        })
);

export default presenceReducer

export function getName(state: PresenceState) {
    return state.name
}
