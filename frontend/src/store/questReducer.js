import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_QUESTS = 'quest/loadQuests';
const LOAD_QUEST = 'quest/loadQuest';
const ADD_QUEST = 'quest/addQuest';
const UPDATE_QUEST = 'quest/updateQuest';
const DELETE_QUEST = 'quest/deleteQuest';

const loadQuests = quests => {
    return {
        type: LOAD_QUESTS,
        quests
    };
};

const loadQuest = quest => {
    return {
        type: LOAD_QUEST,
        quest
    };
};

const addQuest = quest => {
    return {
        type: ADD_QUEST,
        quest
    };
};

const updateQuest = quest => {
    return {
        type: UPDATE_QUEST,
        quest
    };
};

const deleteQuest = questId => {
    return {
        type: DELETE_QUEST,
        questId
    };
};

export const fetchQuests = () => async dispatch => {
    const res = await csrfFetch('/api/quests/current');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadQuests(data.Quests));
        return data;
    }
};

export const fetchQuest = questId => async dispatch => {
    const res = await csrfFetch(`/api/quests/current/${questId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadQuest(data));
    }
};

export const createQuest = quest => async dispatch => {
    const res = await csrfFetch('/api/quests/current', {
        method: 'POST',
        body: JSON.stringify(quest)
    });

    if (res.ok) {
        const newQuest = await res.json();
        dispatch(addQuest(newQuest));
        return newQuest;
    }
};

export const modifyQuest = quest => async dispatch => {
    const res = await csrfFetch(`/api/quests/current/${quest.id}`, {
        method: 'PUT',
        body: JSON.stringify(quest)
    });

    if (res.ok) {
        const updatedQuest = await res.json();
        dispatch(updateQuest(updatedQuest));
        return updatedQuest;
    }
};

export const removeQuest = questId => async dispatch => {
    const res = await csrfFetch(`/api/quests/current/${questId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteQuest(questId));
    } else {
        const errors = await res.json();
        return errors;
    }
};

const selectQuests = state => state?.quests;

export const selectAllQuests = createSelector(selectQuests, quests => {
    return quests ? Object.values(quests) : null;
});

export const selectQuest = questId => state => {
    return state.quests ? state.quests[questId] : null;
};

const initialState = {};

const questReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_QUESTS: {
            const questsState = {};
            action.quests.forEach((quest) => {
                questsState[quest.id] = quest;
            });
            return questsState;
        }
        case LOAD_QUEST:
            return { ...state, [action.quest.id]: action.quest };
        case ADD_QUEST:
            return { ...state, [action.quest.id]: action.quest };
        case UPDATE_QUEST:
            return { ...state, [action.quest.id]: action.quest };
        case DELETE_QUEST: {
            const newState = { ...state };
            delete newState[action.questId];
            return newState;
        }
        default:
            return state;
    }
};

export default questReducer;
