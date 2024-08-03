import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { characterPic } from '../CharacterPage/CharacterPage';
import './FriendsList.css'

import { fetchRequests, confirmRequest, selectAllRequests, denyRequest } from '../../store/requestReducer';
import { fetchFriends, removeFriend, selectAllFriends } from '../../store/friendReducer';

function FriendsListPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const requests = useSelector(selectAllRequests);
    const friends = useSelector(selectAllFriends);

    useEffect(() => {
        dispatch(fetchFriends());
        dispatch(fetchRequests());
    }, [dispatch]);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    return (
        <>
            <div className='friend-list-all'>
                <div className='friend-list-container'>
                    {requests.length && <ul className='all-requests'>
                        {requests && requests.map(request => {
                            const character = request.Character;

                            return (
                                <div
                                    className='request-tile'
                                    onClick={() => {
                                        navigate(`/characters/${character?.id}`)
                                    }}
                                    key={`request-${character?.id}`}
                                >
                                    <img className='request-pic' src={characterPic(character)} alt={`Character ${character?.name}`} />
                                    <div className='request-tile-info'>
                                        <p className='request-name'>Name: {character?.name}</p>
                                        <p className='request-level'>Level: {character?.level}</p>
                                        <p className='request-status'>{character?.status}</p>
                                    </div>
                                    {request.type === 'received' && (
                                        <button
                                            className='accept-request'
                                            onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                return dispatch(confirmRequest({
                                                    id: request.id,
                                                    addresserId: request.addresserId,
                                                    addresseeId: request.addresseeId,
                                                    status: 'accepted'
                                                }));
                                            }}
                                        >
                                            <i className="fa-regular fa-circle-check"></i>
                                        </button>
                                    )}
                                    <button
                                        className='reject-request'
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            return dispatch(denyRequest(request.id));
                                        }}
                                    >
                                        <i className="fa-regular fa-circle-xmark"></i>
                                    </button>
                                </div>
                            )
                        })}
                    </ul>
                    }
                    <ul className='all-friends'>
                        {friends && friends.map(friend => {
                            const character = friend.Character;

                            return (
                                <div
                                    className='friend-tile'
                                    onClick={() => {
                                        navigate(`/characters/${character?.id}`)
                                    }}
                                    key={`friend-${character?.id}`}
                                >
                                    <img className='friend-pic' src={character ? characterPic(character) : ''} alt={`Character ${character?.name}`} />
                                    <div className='friend-tile-info'>
                                        <p className='friend-name'>Name: {character?.name}</p>
                                        <p className='friend-level'>Level: {character?.level}</p>
                                        <p className='friend-status'>{character?.status}</p>
                                    </div>
                                    <button
                                        className='remove-friend'
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            return dispatch(removeFriend(friend.id))
                                        }}
                                    >
                                        Remove Friend?
                                    </button>
                                </div>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default FriendsListPage;
