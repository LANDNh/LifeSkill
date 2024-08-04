import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { fetchUserCharacter, fetchCharacter, selectCharacter } from '../../store/characterReducer';
import { useEffect, useState } from 'react';
import './CharacterPage.css';

import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton';
import CharacterCreateModal from '../CharacterCreateModal';
import CharacterEditModal from '../CharacterEditModal';
import CharacterDeleteModal from '../CharacterDeleteModal';

export const characterPic = character => {
    let charPic;

    if (character) {
        switch (character.skin) {
            case 2:
                switch (character.eyes) {
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
                switch (character.eyes) {
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
                switch (character.eyes) {
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
    return charPic;
};

function CharacterPage() {
    const { setModalContent } = useModal();
    const dispatch = useDispatch();
    const { characterId } = useParams();
    const location = useLocation();
    const sessionUser = useSelector(state => state.session.user);
    const isCurrentUserCharacter = location.pathname === '/characters/current';
    const character = useSelector(state => selectCharacter(state, characterId || (isCurrentUserCharacter ? 'current' : null)));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isCurrentUserCharacter) {
            dispatch(fetchUserCharacter())
                .finally(() => setIsLoading(false));
        } else if (characterId) {
            dispatch(fetchCharacter(characterId))
                .finally(() => setIsLoading(false));
        }
    }, [dispatch, characterId, isCurrentUserCharacter]);

    useEffect(() => {
        if (!isLoading && !character && isCurrentUserCharacter) {
            setModalContent(<CharacterCreateModal />);
        }
    }, [character, isLoading, setModalContent, isCurrentUserCharacter]);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    if (character) {
        return (
            <div className='character-page-all'>
                <div className='character-page-container'>
                    <div className='character-info'>
                        {isCurrentUserCharacter && <span className='character-edit'>
                            <OpenModalButton
                                buttonText='Edit Character'
                                modalComponent={<CharacterEditModal character={character} />}
                            />
                        </span>}
                        <img className='character-pic' src={characterPic(character)} alt={`Character ${character.name}`} />
                        {isCurrentUserCharacter && <span className='character-delete'>
                            <OpenModalButton
                                buttonText='Delete Character'
                                modalComponent={<CharacterDeleteModal />}
                            />
                        </span>}
                        <p className='character-name'>Name: {character.name}</p>
                        <p className='character-lvl'>Level: {character.level}</p>
                        <div className='character-xp'>
                            <div className='xp-bar-fill' style={{ width: `${Math.min(character.totalXp, 100)}%` }}>
                                <span className='xp-text'>{character.totalXp} XP</span>
                            </div>
                        </div>
                        <p className='character-coins'>Coins: {character.totalCoins}</p>
                        <p className='character-status'>{character.status}</p>
                    </div>
                </div>
            </div>
        )
    }

    return null;
}

export default CharacterPage;
