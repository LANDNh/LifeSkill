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

export const sendMessage = (messageData, skipApi = false) => async dispatch => {
    dispatch(addMessage(messageData));

    if (!skipApi) {
        const res = await csrfFetch('/api/chat/send', {
            method: 'POST',
            body: JSON.stringify(messageData),
        });

        if (!res.ok) {
            console.error('Failed to send message');
        }
    }
};

const selectGlobalMessages = (state) => state.chat.globalMessages;

export const getGlobalMessages = createSelector(selectGlobalMessages, globalMessages => {
    return globalMessages ? Object.values(globalMessages) : [];
});

const getPrivateChatKey = (senderId, receiverId) => {
    return [senderId, receiverId].sort().join('-');
};

export const getPrivateMessages = createSelector(
    (state) => state.chat.privateMessages,
    (state, senderId, receiverId) => getPrivateChatKey(senderId, receiverId),

    (privateMessages, key) => {
        return privateMessages[key] || [];
    }
);

const initialState = {
    globalMessages: [],
    privateMessages: {}, // Keyed by senderId & receiverId
    processedMessageIds: new Set(), // Track already processed messages by id
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GLOBAL:
            return { ...state, globalMessages: action.messages };
        case LOAD_PRIVATE: {
            const { senderId, receiverId, messages } = action;
            const key = [senderId, receiverId].sort().join('-');


            const existingMessages = state.privateMessages[key] || [];
            const existingMessageIds = new Set(existingMessages.map(msg => msg.id));

            // Merge only new messages
            const newMessages = messages.filter(msg => !existingMessageIds.has(msg.id));

            return {
                ...state,
                privateMessages: {
                    ...state.privateMessages,
                    [key]: [...existingMessages, ...newMessages],
                },
            };
        }
        case ADD_MESSAGE: {
            const { message } = action;

            // Check if the message has already been processed
            if (state.processedMessageIds.has(message.id)) {
                return state; // Ignore duplicate messages
            }

            const updatedProcessedIds = new Set(state.processedMessageIds);
            updatedProcessedIds.add(message.id);

            if (message.receiverId === null) {
                // Global message
                return {
                    ...state,
                    globalMessages: [...state.globalMessages, message],
                    processedMessageIds: updatedProcessedIds,
                };
            } else {
                // Private message
                const key = [message.senderId, message.receiverId].sort().join('-');

                const existingMessages = state.privateMessages[key] || [];
                const updatedMessages = existingMessages.filter(msg => msg.id !== message.id);

                return {
                    ...state,
                    privateMessages: {
                        ...state.privateMessages,
                        [key]: [...updatedMessages, message]
                    },
                    processedMessageIds: updatedProcessedIds,
                };
            }
        }
        default:
            return state;
    }
};

export default chatReducer;
