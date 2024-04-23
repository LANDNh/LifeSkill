import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_CHARACTERS = 'characters/loadCharacters';
const LOAD_CHARACTER = 'character/loadCharacter';
const LOAD_USER_CHARACTER = 'character/loadUserCharacter';
const ADD_CHARACTER = 'character/addCharacter';
const UPDATE_CHARACTER = 'character/updateCharacter';
const DELETE_CHARACTER = 'character/deleteCharacter';

const loadCharacters = characters => {
    return {
        type: LOAD_CHARACTERS,
        characters
    };
};

const loadUserCharacter = character => {
    return {
        type: LOAD_USER_CHARACTER,
        character
    };
};

const loadCharacter = character => {
    return {
        type: LOAD_CHARACTER,
        character
    };
};

const addCharacter = character => {
    return {
        type: ADD_CHARACTER,
        character
    };
};

const updateCharacter = character => {
    return {
        type: UPDATE_CHARACTER,
        character
    };
};

const deleteCharacter = () => {
    return {
        type: DELETE_CHARACTER,
    };
};

export const fetchCharacters = () => async dispatch => {
    const res = await csrfFetch('/api/characters');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadCharacters(data.Characters));
        return data;
    }
};

export const fetchUserCharacter = () => async dispatch => {
    const res = await csrfFetch('/api/characters/current');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadUserCharacter(data));
    }
};

export const fetchCharacter = characterId => async dispatch => {
    const res = await csrfFetch(`/api/characters/${characterId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadCharacter(data));
    }
};

export const createCharacter = character => async dispatch => {
    const res = await csrfFetch('/api/characters/current', {
        method: 'POST',
        body: JSON.stringify(character)
    });

    if (res.ok) {
        const newCharacter = await res.json();
        dispatch(addCharacter(newCharacter));
        return newCharacter;
    }
};

export const modifyCharacter = character => async dispatch => {
    const res = await csrfFetch('/api/characters/current', {
        method: 'PUT',
        body: JSON.stringify(character)
    });

    if (res.ok) {
        const updatedCharacter = await res.json();
        dispatch(updateCharacter(updatedCharacter));
        return updatedCharacter;
    }
};

export const removeCharacter = () => async dispatch => {
    const res = await csrfFetch('/api/characters/current', {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteCharacter());
    } else {
        const errors = await res.json();
        return errors;
    }
};

const selectCharacters = state => state?.characters;

export const selectAllCharacters = createSelector(selectCharacters, characters => {
    return characters ? Object.values(characters) : null;
});

export const selectCharacter = state => state.characters.userCharacter;

const initialState = {};

const characterReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CHARACTERS:
            return { ...state, characters: action.characters };
        case LOAD_USER_CHARACTER:
            return { ...state, userCharacter: action.character };
        case LOAD_CHARACTER:
            return { ...state, character: action.character };
        case ADD_CHARACTER:
            return { ...state, character: action.character };
        case UPDATE_CHARACTER:
            return { ...state, character: action.character };
        case DELETE_CHARACTER:
            return { ...state, character: null };
        default:
            return state;
    }
};

export default characterReducer;
