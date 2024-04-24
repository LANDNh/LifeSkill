import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchUserCharacter, selectCharacter } from '../../store/characterReducer';
import { useEffect, useState } from 'react';
import './CharacterPage.css';

import { useModal } from '../../context/Modal';
import CharacterCreateModal from '../CharacterCreateModal';

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
                switch (userCharacter.eyes) {
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
                switch (userCharacter.eyes) {
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
