import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './QuestsList.css';
import { fetchUserCharacter, selectCharacter } from '../../store/characterReducer';
import { fetchQuests, selectAllQuests } from '../../store/questReducer';

import { useModal } from '../../context/Modal';
import QuestCreateModal from '../QuestCreateModal';

function QuestsListPage() {
    const { setModalContent } = useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const character = useSelector(selectCharacter);
    const quests = useSelector(selectAllQuests);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchQuests());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchUserCharacter())
            .finally(() => setIsLoading(false));
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && !character) {
            navigate('/characters/current')
        }
    }, [isLoading, character, navigate]);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    const handleClick = (e) => {
        e.preventDefault();

        setModalContent(<QuestCreateModal />)
    }

    const difficultyClass = (difficulty) => {
        const difficultyClasses = {
            1: 'difficulty-d',
            2: 'difficulty-c',
            3: 'difficulty-b',
            4: 'difficulty-a',
            5: 'difficulty-s'
        };
        return difficultyClasses[difficulty] || 'difficulty-unknown';
    }

    const difficultyLetter = (difficulty) => {
        const difficultyClass = {
            1: 'D',
            2: 'C',
            3: 'B',
            4: 'A',
            5: 'S'
        };
        return difficultyClass[difficulty] || '???';
    }

    return (
        <>
            <div className='quest-list-all'>
                <div className='quest-list-container'>
                    <ul className='all-tiles'>
                        {quests && quests.map(quest => (
                            <div
                                className='quest-tile'
                                onClick={() => {
                                    navigate(`/quests/current/${quest.id}`)
                                }}
                                key={quest.id}
                            >
                                <div className='quest-prev'>
                                    <img
                                        src="../../../images/quest/LifeSkill-quest.png"
                                        alt={quest.title}
                                    />
                                </div>
                                <div className='tile-info'>
                                    <p className='quest-title'>{quest.title}</p>
                                    <p className={`quest-difficulty ${difficultyClass(quest.difficultyAggregate)}`}>
                                        Class: {difficultyLetter(quest.difficultyAggregate)}
                                    </p>
                                    <p className='quest-type'>Quest Type: {quest.type}</p>
                                    <div className='quest-coins'>
                                        <p className='coins'>Reward: <i className='fa-solid fa-coins'></i>{quest.completionCoins}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div
                            className='quest-tile create-quest'
                            onClick={handleClick}
                        >
                            <i className="fa-solid fa-pen-fancy"></i>
                            <p>Create a New Quest</p>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default QuestsListPage;