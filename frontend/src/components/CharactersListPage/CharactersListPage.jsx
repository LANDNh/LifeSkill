import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { characterPic } from '../CharacterPage/CharacterPage';
import './CharactersList.css'

import { fetchCharacters, selectAllCharacters } from '../../store/characterReducer';
import { createRequest, fetchRequests } from '../../store/requestReducer';

export const textTruncate = (text, length = 50) => {
    if (text.length > length) {
        return text.slice(0, length) + '...';
    }
    return text;
}

function CharactersListPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const characters = useSelector(selectAllCharacters);
    const [requestedCharacters, setRequestedCharacters] = useState([]);
    const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth <= 400);

    useEffect(() => {
        dispatch(fetchCharacters());
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

    const filteredCharacters = characters?.filter(character => !requestedCharacters.includes(character.id));

    return (
        <>
            <div className='character-list-all'>
                <div className='character-list-container'>
                    <ul className='all-characters'>
                        {filteredCharacters && filteredCharacters.map(character => (
                            <div
                                className='character-tile'
                                onClick={() => {
                                    navigate(`/characters/${character.id}`)
                                }}
                                key={character.id}
                            >
                                {isScreenSmall ? (
                                    <>
                                        <div className='pic-name-lvl'>
                                            <img className='char-pic' src={characterPic(character)} alt={`Character ${character.name}`} />
                                            <p className='char-name'>Name: {character.name}</p>
                                            <p className='char-level'>Level: {character.level}</p>
                                        </div>
                                        <div className='character-tile-info'>
                                            <p className='char-status'>{textTruncate(character.status)}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <img className='char-pic' src={characterPic(character)} alt={`Character ${character.name}`} />
                                        <div className='character-tile-info'>
                                            <p className='char-name'>Name: {character.name}</p>
                                            <p className='char-level'>Level: {character.level}</p>
                                            <p className='char-status'>{character.status}</p>
                                        </div>
                                    </>
                                )}
                                <button
                                    className='add-friend'
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        dispatch(createRequest(character));
                                        setRequestedCharacters([...requestedCharacters, character.id]);
                                    }}
                                >
                                    Add Friend?
                                </button>
                            </div>
                        ))}
                    </ul>
                </div >
            </div >
        </>
    )
}

export default CharactersListPage;
