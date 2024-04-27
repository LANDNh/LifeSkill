import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_QUESTSTEPS = 'questStep/loadQuestSteps';
const ADD_QUESTSTEP = 'questStep/addQuestStep';
const UPDATE_QUESTSTEP = 'questStep/updateQuestStep';
const DELETE_QUESTSTEP = 'questStep/deleteQuestStep';

const loadQuestSteps = questSteps => {
    return {
        type: LOAD_QUESTSTEPS,
        questSteps
    };
};

const addQuestStep = questStep => {
    return {
        type: ADD_QUESTSTEP,
        questStep
    };
};

const updateQuestStep = questStep => {
    return {
        type: UPDATE_QUESTSTEP,
        questStep
    };
};

const deleteQuestStep = (questStepId) => {
    return {
        type: DELETE_QUESTSTEP,
        questStepId
    };
};

export const fetchQuestSteps = questId => async dispatch => {
    const res = await csrfFetch(`/api/quests/current/${questId}/quest-steps`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadQuestSteps(data.QuestSteps));
        return data;
    }
};

export const createQuestStep = (questId, questStep) => async dispatch => {
    const res = await csrfFetch(`/api/quests/current/${questId}/quest-steps`, {
        method: 'POST',
        body: JSON.stringify(questStep)
    });

    if (res.ok) {
        const newQuestStep = await res.json();
        dispatch(addQuestStep(newQuestStep));
        return newQuestStep;
    }
};

export const modifyQuestStep = questStep => async dispatch => {
    try {
        const res = await csrfFetch(`/api/quest-steps/${questStep.id}`, {
            method: 'PUT',
            body: JSON.stringify(questStep),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            const updatedQuestStep = await res.json();
            dispatch(updateQuestStep(updatedQuestStep));
            return updatedQuestStep;
        } else {
            const errorData = await res.json();
            console.error('Failed to update quest step:', errorData);
            throw new Error('Failed to update quest step');
        }
    } catch (error) {
        console.error('Error in modifyQuestStep:', error);
        throw error;
    }
};

export const removeQuestStep = questStepId => async dispatch => {
    const res = await csrfFetch(`/api/quest-steps/${questStepId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteQuestStep(questStepId));
    } else {
        const errors = await res.json();
        return errors;
    }
};

const selectQuestSteps = state => state?.questSteps;

export const selectAllQuestSteps = createSelector(selectQuestSteps, questSteps => {
    return questSteps ? Object.values(questSteps) : null;
});

const initialState = {};

const questStepReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_QUESTSTEPS: {
            const questStepsState = {};
            action.questSteps.forEach((questStep) => {
                questStepsState[questStep.id] = questStep;
            });
            return questStepsState;
        }
        case ADD_QUESTSTEP:
            return { ...state, [action.questStep.id]: action.questStep };
        case UPDATE_QUESTSTEP:
            return { ...state, [action.questStep.id]: action.questStep };
        case DELETE_QUESTSTEP: {
            const newState = { ...state };
            delete newState[action.questStepId];
            return newState;
        }
        default:
            return state;
    }
};

export default questStepReducer;
