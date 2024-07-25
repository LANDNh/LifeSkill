import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const ADD_REQUEST = 'request/addRequest';

const addRequest = request => {
    return {
        type: ADD_REQUEST,
        request
    };
};

export const createRequest = requestChar => async dispatch => {
    const res = await csrfFetch(`/api/characters/${requestChar.id}`, {
        method: 'POST'
    });

    if (res.ok) {
        const newRequest = await res.json();
        dispatch(addRequest(newRequest));
        return newRequest;
    }
};

const initialState = {};

const requestReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REQUEST:
            return { ...state, request: action.request };
        default:
            return state;
    }
};

export default requestReducer;