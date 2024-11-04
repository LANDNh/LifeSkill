import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

const LOAD_GLOBAL = 'chat/loadGlobal';
const LOAD_PRIVATE = 'chat/loadPrivate';
const ADD_MESSAGE = 'chat/addMessage';

const loadGlobal = messages => ({
    type: LOAD_GLOBAL,
    messages
});

const loadPrivate = (messages, senderId, receiverId) => ({
    type: LOAD_PRIVATE,
    messages,
    senderId,
    receiverId
});

const addMessage = message => ({
    type: ADD_MESSAGE,
    message
});

export const fetchGlobal = () => async dispatch => {
    const res = await csrfFetch('/api/chat');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadGlobal(data))
    }
};

export const fetchPrivate = (senderId, receiverId) => async dispatch => {
    const res = await csrfFetch(`/api/chat/${senderId}/${receiverId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadPrivate(data, senderId, receiverId));
    }
};

export const sendMessage = messageData => async dispatch => {
    const res = await csrfFetch('/api/chat/send', {
        method: 'POST',
        body: JSON.stringify(messageData),
    });

    if (res.ok) {
        const message = await res.json();
        dispatch(addMessage(message));
    }
};

const selectGlobalMessages = (state) => state.chat.globalMessages;
const selectPrivateMessages = (state, senderId, receiverId) => {
    const key = [senderId, receiverId].sort().join('-');
    return state.chat.privateMessages[key] || [];
};

export const getGlobalMessages = createSelector(selectGlobalMessages, globalMessages => {
    return globalMessages ? Object.values(globalMessages) : [];
});

export const getPrivateMessages = createSelector((state, senderId, receiverId) => selectPrivateMessages(state, senderId, receiverId),
    privateMessages => {
        return privateMessages ? Object.values(privateMessages) : [];
    });

const initialState = {
    globalMessages: [],
    privateMessages: {} // Keyed by senderId & receiverId
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GLOBAL:
            return { ...state, globalMessages: action.messages };
        case LOAD_PRIVATE: {
            const { senderId, receiverId, messages } = action;
            const key = [senderId, receiverId].sort().join('-');

            return {
                ...state,
                privateMessages: {
                    ...state.privateMessages,
                    [key]: messages
                },
            };
        }
        case ADD_MESSAGE: {
            const { message } = action;

            if (message.receiverId === null) {
                // Global message
                return { ...state, globalMessages: [...state.globalMessages, message] };
            } else {
                // Private message
                const key = [message.senderId, message.receiverId].sort().join('-');

                return {
                    ...state,
                    privateMessages: {
                        ...state.privateMessages,
                        [key]: [...(state.privateMessages[key] || []), message]
                    },
                };
            }
        }
        default:
            return state;
    }
};

export default chatReducer;
