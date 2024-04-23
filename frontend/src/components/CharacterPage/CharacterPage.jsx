import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchUserCharacter, selectCharacter } from '../../store/characterReducer';
import { useEffect, useState } from 'react';
import './CharacterPage.css';

import OpenModalButton from '../OpenModalButton';
import { useModal } from '../../context/Modal';
import CharacterCreateModal from '../CharacterCreateModal';

function CharacterPage() {
    const { setModalContent } = useModal();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const character = useSelector(selectCharacter);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        dispatch(fetchUserCharacter())
            .finally(() => setIsLoading(false));
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && !character) {
            setModalContent(<CharacterCreateModal />);
        }
    }, [character, isLoading, setModalContent]);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    let charPic;

    if (character) {
        switch (character.skin) {
            case 2:
                switch (character.eyes) {
                    case 2:
                        charPic = '../../../images/character/char-tan-blue.png';
                        break;
                    case 3:
                        charPic = '../../../images/character/char-tan-green.png';
                        break;
                    default:
                        charPic = '../../../images/character/char-tan-brown.png';
                }
                break;
            case 3:
                switch (character.eyes) {
                    case 2:
                        charPic = '../../../images/character/char-brown-blue.png';
                        break;
                    case 3:
                        charPic = '../../../images/character/char-brown-green.png';
                        break;
                    default:
                        charPic = '../../../images/character/char-brown-brown.png';
                }
                break;
            default:
                switch (character.eyes) {
                    case 2:
                        charPic = '../../../images/character/char-white-blue.png';
                        break;
                    case 3:
                        charPic = '../../../images/character/char-white-green.png';
                        break;
                    default:
                        charPic = '../../../images/character/char-white-brown.png';
                }
        }
    }

    return (
        <div className='character-page-all'>
            <div className='character-page-container'>
                <img src={charPic} alt={`Character `} />
            </div>
        </div>
    )

}

export default CharacterPage;
