import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './CharactersPage.css'

import { fetchCharacters, selectAllCharacters } from '../../store/characterReducer';

function CharactersListPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const characters = useSelector(selectAllCharacters);

    useEffect(() => {
        dispatch(fetchCharacters());
    }, [dispatch]);

    console.log(characters)

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    return (
        <>
            <div className='character-list-all'>
                <div className='character-list-container'>
                    <ul className='all-characters'>
                        {characters && characters.map(character => (
                            <div
                                className='character-tile'
                                onClick={() => {
                                    navigate(`/characters/${character.id}`)
                                }}
                                key={character.id}
                            >
                                <div className='character-tile-info'>
                                    <p className='char-name'>Name: {character.name}</p>
                                    <p className='char-level'>Level: {character.level}</p>
                                    <p className='char-status'>{character.status}</p>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default CharactersListPage;
