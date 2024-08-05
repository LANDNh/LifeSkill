import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_REQUESTS = 'request/loadRequests';
const ADD_REQUEST = 'request/addRequest';
const ACCEPT_REQUEST = 'request/acceptRequest';
const REJECT_REQUEST = 'request/rejectRequest';
const REMOVE_REQUEST = 'request/removeRequest';

const loadRequests = requests => {
    return {
        type: LOAD_REQUESTS,
        requests
    };
};

const addRequest = request => {
    return {
        type: ADD_REQUEST,
        request
    };
};

const acceptRequest = request => {
    return {
        type: ACCEPT_REQUEST,
        request
    };
};

const rejectRequest = requestId => {
    return {
        type: REJECT_REQUEST,
        requestId
    };
};

const removeRequest = requestId => {
    return {
        type: REMOVE_REQUEST,
        requestId
    };
};

export const fetchRequests = () => async dispatch => {
    const res = await csrfFetch('/api/friends/requests');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadRequests(data.Requests));
        return data;
    }
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

export const confirmRequest = request => async dispatch => {
    const res = await csrfFetch(`/api/friends/requests/${request.id}`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

    if (res.ok) {
        const acceptedRequest = await res.json();
        dispatch(acceptRequest(acceptedRequest));

        const friend = {
            id: acceptedRequest.id,
            status: acceptedRequest.status,
            Character: acceptedRequest.Character
        }
        dispatch({ type: 'friend/addFriend', friend }); // Adds to state.friends

        dispatch(removeRequest(request.id)); // Removes from state.requests
    }
};

export const denyRequest = requestId => async dispatch => {
    const res = await csrfFetch(`/api/friends/${requestId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(rejectRequest(requestId));
    } else {
        const errors = await res.json();
        return errors;
    }
};

const selectRequests = state => state?.requests;

export const selectAllRequests = createSelector(selectRequests, requests => {
    return requests ? Object.values(requests) : null;
});

const initialState = {};

const requestReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REQUESTS: {
            const requestsState = {};
            action.requests.forEach((request) => {
                requestsState[request.id] = request;
            });
            return requestsState;
        }
        case ADD_REQUEST:
            return { ...state, [action.request.id]: action.request };
        case ACCEPT_REQUEST:
            return { ...state, [action.request.id]: action.request };
        case REJECT_REQUEST: {
            const newState = { ...state };
            delete newState[action.requestId];
            return newState;
        }
        case REMOVE_REQUEST: {
            const newState = { ...state };
            delete newState[action.requestId];
            return newState;
        }
        default:
            return state;
    }
};

export default requestReducer;
