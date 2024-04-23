import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchCharacter, selectCharacter } from '../../store/characterReducer';
import { useEffect } from 'react';
import './CharacterPage.css';

import OpenModalButton from '../OpenModalButton';
import { useModal } from '../../context/Modal';
import CharacterCreateModal from '../CharacterCreateModal';

function CharacterPage() {
    const { setModalContent } = useModal();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const character = useSelector(selectCharacter);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    useEffect(() => {
        dispatch(fetchCharacter());
    }, [dispatch]);

    useEffect(() => {
        if (!character) {
            setModalContent(<CharacterCreateModal />);
        }
    }, [character, setModalContent]);

    return (
        <div className='character-page-all'>
            <div className='character-page-container'>

            </div>
        </div>
    )
}

export default CharacterPage;
