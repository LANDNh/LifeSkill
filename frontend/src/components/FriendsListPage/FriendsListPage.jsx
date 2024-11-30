import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './FriendsList.css'

import { fetchRequests, confirmRequest, selectAllRequests, denyRequest } from '../../store/requestReducer';
import { fetchFriends, removeFriend, selectAllFriends } from '../../store/friendReducer';
import { fetchUserCharacter } from '../../store/characterReducer';

import { characterPic } from '../CharacterPage/CharacterPage';
import { textTruncate } from '../CharactersListPage/CharactersListPage';
import OpenModalButton from '../OpenModalButton';
import PrivateChatModal from '../PrivateChatModal';

function FriendsListPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const userCharacter = useSelector(state => state.characters.userCharacter);
    const requests = useSelector(selectAllRequests);
    const friends = useSelector(selectAllFriends);
    const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth <= 400);

    useEffect(() => {
        dispatch(fetchUserCharacter());
        dispatch(fetchFriends());
        dispatch(fetchRequests());
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => {
            setIsScreenSmall(window.innerWidth <= 400);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    return (
        <>
            <div className='friend-list-all'>
                <div className='friend-list-container'>
                    {requests.length > 0 && <ul className='all-requests'>
                        <p className='list-header'>Requests</p>
                        {requests && requests.map(request => {
                            const character = request.Addressee?.Character || request.Addresser?.Character;

                            return (
                                <div
                                    className='request-tile'
                                    onClick={() => {
                                        navigate(`/characters/${character?.id}`)
                                    }}
                                    key={`request-${character?.id}`}
                                >
                                    {isScreenSmall ? (
                                        <>
                                            <div className='pic-name-lvl'>
                                                <img className='request-pic' src={characterPic(character)} alt={`Character ${character?.name}`} />
                                                <p className='request-name'>Name: {character?.name}</p>
                                                <p className='request-level'>Level: {character?.level}</p>
                                            </div>
                                            <div className='request-tile-info'>
                                                <p className='request-status'>{textTruncate(character?.status)}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <img className='request-pic' src={characterPic(character)} alt={`Character ${character?.name}`} />
                                            <div className='request-tile-info'>
                                                <p className='request-name'>Name: {character?.name}</p>
                                                <p className='request-level'>Level: {character?.level}</p>
                                                <p className='request-status'>{character?.status}</p>
                                            </div>
                                        </>
                                    )}
                                    <span
                                        className='message-request-user'
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <OpenModalButton
                                            buttonText={<img src='https://lifeskill-bucket.s3.us-east-1.amazonaws.com/images/circle-message.png' />}
                                            modalComponent={
                                                <PrivateChatModal
                                                    senderId={userCharacter.id}
                                                    receiverId={character.id}
                                                    senderCharacter={userCharacter}
                                                    receiverCharacter={character}
                                                />
                                            }
                                        />
                                    </span>
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
                        <p className='list-header'>Friends</p>
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
                                    {isScreenSmall ? (
                                        <>
                                            <div className='pic-name-lvl'>
                                                <img className='friend-pic' src={character ? characterPic(character) : ''} alt={`Character ${character?.name}`} />
                                                <p className='friend-name'>Name: {character?.name}</p>
                                                <p className='friend-level'>Level: {character?.level}</p>
                                            </div>
                                            <div className='friend-tile-info'>
                                                <p className='friend-status'>{textTruncate(character?.status)}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <img className='friend-pic' src={character ? characterPic(character) : ''} alt={`Character ${character?.name}`} />
                                            <div className='friend-tile-info'>
                                                <p className='friend-name'>Name: {character?.name}</p>
                                                <p className='friend-level'>Level: {character?.level}</p>
                                                <p className='friend-status'>{character?.status}</p>
                                            </div>
                                        </>
                                    )}
                                    <span
                                        className='message-request-user'
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <OpenModalButton
                                            buttonText={<img src='https://lifeskill-bucket.s3.us-east-1.amazonaws.com/images/circle-message.png' />}
                                            modalComponent={
                                                <PrivateChatModal
                                                    senderId={userCharacter.id}
                                                    receiverId={character.id}
                                                    senderCharacter={userCharacter}
                                                    receiverCharacter={character}
                                                />
                                            }
                                        />
                                    </span>
                                    <button
                                        className='remove-friend'
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            return dispatch(removeFriend(friend.id))
                                        }}
                                    >
                                        <i className="fa-regular fa-circle-xmark"></i>
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
