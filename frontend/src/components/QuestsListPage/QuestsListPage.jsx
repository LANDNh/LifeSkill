import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './QuestsList.css';
import { selectCharacter } from '../../store/characterReducer';
import { fetchQuests, selectAllQuests } from '../../store/questReducer';

function QuestsListPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const character = useSelector(selectCharacter);
    const quests = useSelector(selectAllQuests);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchQuests())
            .finally(() => setIsLoading(false));
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && !character) {
            return <Navigate to='/characters/current' replace={true} />
        }
    }, [isLoading, character]);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    console.log(quests)

    return (
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
                                <p>{quest.title}</p>
                                <div className='quest-difficulty'>
                                    {quest.difficultyAggregate ? (
                                        <p>Class: {(() => {
                                            const difficultyClass = {
                                                1: 'D',
                                                2: 'C',
                                                3: 'B',
                                                4: 'A',
                                                5: 'S'
                                            };
                                            return difficultyClass[quest.difficultyAggregate] || '???';
                                        })()}</p>
                                    ) : (
                                        <p>Class: ???</p>
                                    )}
                                </div>
                                <div className='quest-coins'>
                                    <p className='coins'><i className='fa-solid fa-coins'></i>{quest.completionCoins}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className='create-quest-tile'>

                    </div>
                </ul>
            </div>
        </div>
    )
}

export default QuestsListPage;
