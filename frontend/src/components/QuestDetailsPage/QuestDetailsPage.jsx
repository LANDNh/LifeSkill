import { csrfFetch } from '../../store/csrf';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

import { fetchUserCharacter, selectCharacter } from '../../store/characterReducer';
import { fetchQuest, selectQuest } from '../../store/questReducer';
import { fetchQuestSteps, modifyQuestStep, selectAllQuestSteps } from '../../store/questStepReducer';

import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton';
import QuestEditModal from '../QuestEditModal';
import QuestDeleteModal from '../QuestDeleteModal';
import QuestStepCreateModal from '../QuestStepCreateModal';
import QuestStepEditModal from '../QuestStepEditModal';
import QuestStepDeleteModal from '../QuestStepDeleteModal';
import './QuestDetails.css';

function QuestDetailsPage() {
    const { setModalContent } = useModal();
    const { questId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sessionUser = useSelector(state => state.session.user);
    const character = useSelector(selectCharacter);
    const quest = useSelector(selectQuest(questId));
    const questSteps = useSelector(selectAllQuestSteps);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchQuest(questId));
    }, [dispatch, questId]);

    useEffect(() => {
        dispatch(fetchQuestSteps(questId));
    }, [dispatch, questId]);

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

    const toggleStepComplete = async (questStep) => {
        const updatedQuestStep = { ...questStep, complete: !questStep.complete };
        const res = await csrfFetch(`/api/quest-steps/${questStep.id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedQuestStep),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            const data = await res.json();
            dispatch(modifyQuestStep(data));
        } else {
            const errors = await res.json();
            console.error('Failed to update:', errors);
        }
    };

    const handleClick = (e) => {
        e.preventDefault();

        setModalContent(<QuestStepCreateModal questId={questId} />)
    }

    if (quest) {
        return (
            <>
                <div className='quest-page-all'>
                    <div className='quest-page-container'>
                        <div className='quest-page-info'>
                            <span className='quest-edit'>
                                <OpenModalButton
                                    buttonText='Edit Quest'
                                    modalComponent={<QuestEditModal quest={quest} />}
                                />
                            </span>
                            <p className='quest-page-title'>{quest?.title}</p>
                            <p className={`quest-page-difficulty ${difficultyClass(quest?.difficultyAggregate)}`}>
                                Class: {difficultyLetter(quest?.difficultyAggregate)}
                            </p>
                            <p className='quest-page-description'>{quest?.description}</p>
                            <p className='quest-page-type'>Quest Type: {quest?.type}</p>
                            <div className='quest-page-coins'>
                                {quest?.completionCoins ? (
                                    <p className='coins'>Reward: <i className='fa-solid fa-coins'></i>{quest?.completionCoins}</p>
                                ) : (
                                    <p className='coins'>Reward: <i className='fa-solid fa-coins'></i>???</p>
                                )
                                }
                            </div>
                            <span className='quest-delete'>
                                <OpenModalButton
                                    buttonText='Delete Quest'
                                    modalComponent={<QuestDeleteModal quest={quest} />}
                                />
                            </span>
                        </div>
                        <ul className='quest-steps'>
                            {questSteps && questSteps.map(questStep => {
                                return (
                                    <div className='quest-step' key={questStep.id}>
                                        <input
                                            className='quest-step-complete'
                                            type="checkbox"
                                            checked={questStep.complete}
                                            onChange={() => toggleStepComplete(questStep)}
                                        />
                                        <div className='quest-step-info'>
                                            <p className='quest-step-title'>{questStep.title}</p>
                                            <p className='quest-step-notes'>{questStep.notes}</p>
                                            <p className={`quest-step-difficulty ${difficultyClass(questStep.difficulty)}`}>
                                                Difficulty: {difficultyLetter(questStep.difficulty)}
                                            </p>
                                            <p className='quest-step-xp'>Reward: <i className="fa-solid fa-medal"></i>{questStep.xp}</p>
                                        </div>
                                        <div className='quest-step-buttons'>
                                            <span className='quest-step-edit'>
                                                <OpenModalButton
                                                    buttonText='Edit Step'
                                                    modalComponent={<QuestStepEditModal questStep={questStep} />}
                                                />
                                            </span>
                                            <span className='quest-step-delete'>
                                                <OpenModalButton
                                                    buttonText='Delete Step'
                                                    modalComponent={<QuestStepDeleteModal questStep={questStep} />}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            <div
                                className='quest-step create-quest-step'
                                onClick={handleClick}
                            >
                                <i className="fa-solid fa-pen-fancy"></i>
                                <p>Create a New Quest Step</p>
                            </div>
                        </ul>
                    </div>
                </div>
            </>
        )
    }
}

export default QuestDetailsPage;
