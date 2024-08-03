import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_FRIENDS = 'friend/loadFriends';
const ADD_FRIEND = 'friend/addFriend';
const DELETE_FRIEND = 'friend/deleteFriend';

const loadFriends = friends => {
    return {
        type: LOAD_FRIENDS,
        friends
    };
};

const deleteFriend = friendId => {
    return {
        type: DELETE_FRIEND,
        friendId
    };
};

export const fetchFriends = () => async dispatch => {
    const res = await csrfFetch('/api/friends');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadFriends(data.Friends));
        return data;
    }
};

export const removeFriend = friendId => async dispatch => {
    const res = await csrfFetch(`/api/friends/${friendId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteFriend(friendId));
    } else {
        const errors = await res.json();
        return errors;
    }
};

const selectFriends = state => state?.friends;

export const selectAllFriends = createSelector(selectFriends, friends => {
    return friends ? Object.values(friends) : null;
});

const initialState = {};

const friendReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_FRIENDS: {
            const friendsState = {};
            action.friends.forEach((friend) => {
                friendsState[friend.id] = friend;
            });
            return friendsState;
        }
        case ADD_FRIEND:
            return { ...state, [action.friend.id]: action.friend };
        case DELETE_FRIEND: {
            const newState = { ...state };
            delete newState[action.friendId];
            return newState;
        }
        default:
            return state;
    }
};

export default friendReducer;
