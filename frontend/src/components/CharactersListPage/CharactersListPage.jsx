import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { characterPic } from '../CharacterPage/CharacterPage';
import './CharactersList.css'

import { fetchCharacters, selectAllCharacters } from '../../store/characterReducer';
import { createRequest, fetchRequests } from '../../store/requestReducer';

function CharactersListPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const characters = useSelector(selectAllCharacters);
    const [requestedCharacters, setRequestedCharacters] = useState([]);

    useEffect(() => {
        dispatch(fetchCharacters());
        dispatch(fetchRequests());
    }, [dispatch]);

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
                                <img className='char-pic' src={characterPic(character)} alt={`Character ${character.name}`} />
                                <div className='character-tile-info'>
                                    <p className='char-name'>Name: {character.name}</p>
                                    <p className='char-level'>Level: {character.level}</p>
                                    <p className='char-status'>{character.status}</p>
                                </div>
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
