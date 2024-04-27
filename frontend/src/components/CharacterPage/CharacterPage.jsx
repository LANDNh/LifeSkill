import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchUserCharacter, selectCharacter } from '../../store/characterReducer';
import { useEffect, useState } from 'react';
import './CharacterPage.css';

import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton';
import CharacterCreateModal from '../CharacterCreateModal';
import CharacterEditModal from '../CharacterEditModal';
import CharacterDeleteModal from '../CharacterDeleteModal';

function CharacterPage() {
    const { setModalContent } = useModal();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const userCharacter = useSelector(selectCharacter);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        dispatch(fetchUserCharacter())
            .finally(() => setIsLoading(false));
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && !userCharacter) {
            setModalContent(<CharacterCreateModal />);
        }
    }, [userCharacter, isLoading, setModalContent]);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    let charPic;

    if (userCharacter) {
        switch (userCharacter.skin) {
            case 2:
                switch (userCharacter.eyes) {
                    case 2:
                        charPic = '/images/char-tan-blue.png';
                        break;
                    case 3:
                        charPic = '/images/char-tan-green.png';
                        break;
                    default:
                        charPic = '/images/char-tan-brown.png';
                }
                break;
            case 3:
                switch (userCharacter.eyes) {
                    case 2:
                        charPic = '/images/char-brown-blue.png';
                        break;
                    case 3:
                        charPic = '/images/char-brown-green.png';
                        break;
                    default:
                        charPic = '/images/char-brown-brown.png';
                }
                break;
            default:
                switch (userCharacter.eyes) {
                    case 2:
                        charPic = '/images/char-white-blue.png';
                        break;
                    case 3:
                        charPic = '/images/char-white-green.png';
                        break;
                    default:
                        charPic = '/images/char-white-brown.png';
                }
        }
    }

    if (userCharacter) {
        return (
            <div className='character-page-all'>
                <div className='character-page-container'>
                    <div className='character-info'>
                        <span className='character-edit'>
                            <OpenModalButton
                                buttonText='Edit Character'
                                modalComponent={<CharacterEditModal character={userCharacter} />}
                            />
                        </span>
                        <img className='character-pic' src={charPic} alt={`Character ${userCharacter.name}`} />
                        <span className='character-delete'>
                            <OpenModalButton
                                buttonText='Delete Character'
                                modalComponent={<CharacterDeleteModal />}
                            />
                        </span>
                        <p className='character-name'>Name: {userCharacter.name}</p>
                        <p className='character-lvl'>Level: {userCharacter.level}</p>
                        <div className='character-xp'>
                            <div className='xp-bar-fill' style={{ width: `${Math.min(userCharacter.totalXp, 100)}%` }}>
                                <span className='xp-text'>{userCharacter.totalXp} XP</span>
                            </div>
                        </div>
                        <p className='character-coins'>Coins: {userCharacter.totalCoins}</p>
                        <p className='character-status'>{userCharacter.status}</p>
                    </div>
                </div>
            </div>
        )
    }

}

export default CharacterPage;
