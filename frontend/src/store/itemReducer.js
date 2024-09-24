import { fetchUserCharacter } from "./characterReducer";
import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_ITEMS = 'item/loadItems';
const LOAD_USER_ITEMS = 'item/loadUserItems';
const LOAD_ITEM = 'item/loadItem';
const BUY_ITEM = 'item/buyItem';
const SELL_ITEM = 'item/sellItem';

const loadItems = items => {
    return {
        type: LOAD_ITEMS,
        items
    };
};

const loadUserItems = items => {
    return {
        type: LOAD_USER_ITEMS,
        items
    };
};

const loadItem = item => {
    return {
        type: LOAD_ITEM,
        item
    };
};

const buyItem = item => {
    return {
        type: BUY_ITEM,
        item
    };
};

const sellItem = itemId => {
    return {
        type: SELL_ITEM,
        itemId
    };
};

export const fetchItems = () => async dispatch => {
    const res = await csrfFetch('/api/items');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadItems(data));
    }
};

export const fetchUserItems = () => async dispatch => {
    const res = await csrfFetch('/api/items/sell');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadUserItems(data));
    }
};

export const fetchItem = itemId => async dispatch => {
    const res = await csrfFetch(`/api/items/${itemId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadItem(data));
    }
};

export const purchaseItem = itemId => async dispatch => {
    const res = await csrfFetch(`/api/items/${itemId}`, {
        method: 'POST'
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(buyItem(data));
        dispatch(fetchUserCharacter());
        return data;
    }
};

export const exchangeItem = itemId => async dispatch => {
    const res = await csrfFetch(`/api/items/${itemId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(sellItem(itemId));
        await dispatch(fetchUserCharacter());
    } else {
        const errors = await res.json();
        return errors;
    }
};

const selectAvailableItems = state => state?.items.availableItems;

export const selectAllAvailableItems = createSelector(selectAvailableItems, items => {
    return items ? Object.values(items) : null;
});

const selectUserItems = state => state?.items.userItems;

export const selectAllUserItems = createSelector(selectUserItems, items => {
    return items ? Object.values(items) : null;
});

const initialState = {
    availableItems: {},
    userItems: {}
};

const itemReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ITEMS: {
            const availableItemsState = {};
            action.items.Items.forEach(item => {
                availableItemsState[item.id] = item;
            });
            return {
                ...state,
                availableItems: availableItemsState
            };
        }
        case LOAD_USER_ITEMS: {
            const userItemsState = {};
            action.items.Items.forEach(item => {
                userItemsState[item.id] = item;
            });
            return {
                ...state,
                userItems: userItemsState
            };
        }
        case LOAD_ITEM:
            return {
                ...state,
                availableItems: {
                    ...state.availableItems,
                    [action.item.id]: action.item
                }
            }
        case BUY_ITEM:
            return { ...state };
        case SELL_ITEM: {
            const newState = {
                ...state,
                userItems: { ...state.userItems }
            };
            delete newState.userItems[action.itemId];
            return newState;
        }
        default:
            return state;
    }
};

export default itemReducer;
