import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';

import sessionReducer from './session';
import characterReducer from './characterReducer';
import questReducer from './questReducer';
import questStepReducer from './questStepReducer';
import requestReducer from './requestReducer';
import friendReducer from './friendReducer';
import itemReducer from './itemReducer';

const rootReducer = combineReducers({
    session: sessionReducer,
    characters: characterReducer,
    quests: questReducer,
    questSteps: questStepReducer,
    requests: requestReducer,
    friends: friendReducer,
    items: itemReducer,
});

let enhancer;
if (import.meta.env.MODE === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = (await import("redux-logger")).default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
