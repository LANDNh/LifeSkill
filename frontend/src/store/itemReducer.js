import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_ITEMS = 'item/loadItems';
const LOAD_ITEM = 'item/loadItem';
const BUY_ITEM = 'item/buyItem';
const SELL_ITEM = 'item/sellItem';

const loadItems = items => {
    return {
        type: LOAD_ITEMS,
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
        return data;
    }
};

export const exchangeItem = itemId => async dispatch => {
    const res = csrfFetch(`/api/items/${itemId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(sellItem(itemId));
    } else {
        const errors = await res.json();
        return errors;
    }
};

const selectItems = state => state?.items;

export const selectAllItems = createSelector(selectItems, items => {
    return items ? Object.values(items) : null;
});

const initialState = {};

const itemReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ITEMS: {
            const itemsState = {};
            action.items.Items.forEach(item => {
                itemsState[item.id] = item;
            });
            return itemsState;
        }
        case LOAD_ITEM:
            return { ...state, [action.item.id]: action.item };
        case BUY_ITEM:
            return { ...state, [action.item.id]: action.item };
        case SELL_ITEM: {
            const newState = { ...state };
            delete newState[action.itemId];
            return newState;
        }
        default:
            return state;
    }
};

export default itemReducer;
