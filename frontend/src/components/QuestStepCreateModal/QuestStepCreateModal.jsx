import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './QuestStepCreate.css'

import { createQuestStep } from '../../store/questStepReducer';
import { fetchQuest } from '../../store/questReducer';

function QuestStepCreateModal({ questId }) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [difficulty, setDifficulty] = useState(1);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        let formErrors = {};

        dispatch(createQuestStep(questId, {
            title,
            notes,
            difficulty
        }))
            .then(() => {
                dispatch(fetchQuest(questId));
                closeModal();
            })
            .catch(async res => {
                const data = await res.json();
                if (data && data.errors) {
                    formErrors = { ...formErrors, ...data.errors }
                    setErrors(formErrors);
                }
            });
    };


    const difficultyClass = {
        1: 'D',
        2: 'C',
        3: 'B',
        4: 'A',
        5: 'S'
    };

    const disableQuestStepCreate = {}
    if (!title ||
        !notes ||
        !difficulty) {
        disableQuestStepCreate.disabled = true;
    } else {
        disableQuestStepCreate.disabled = false;
    }

    return (
        <div className='create-quest-step-modal'>
            <h1>Create A New Quest Step</h1>
            <form onSubmit={handleSubmit}>
                <label className='create-quest-step-input'>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Title'
                        required
                    />
                </label>
                {errors.title && <p className='create-quest-step-error'>{errors.title}</p>}
                <label className='create-quest-step-input'>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder='Add your notes (1-200 characters) here...'
                        required
                    ></textarea>
                </label>
                {errors.notes && <p className='create-quest-step-error'>{errors.notes}</p>}
                <label className='create-quest-step-input'>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        required
                    >
                        <option value="">Select a quest step difficulty</option>
                        {Object.entries(difficultyClass).map(([val, classType]) => (
                            <option key={val} value={Number(val)}>
                                {classType}
                            </option>
                        ))}
                    </select>
                </label>
                {errors.difficulty && <p className='create-quest-step-error'>{errors.difficulty}</p>}
                <button
                    className='create-quest-step-submit'
                    type='submit'
                    {...disableQuestStepCreate}
                >Create Quest Step</button>
            </form>
        </div>
    );
}

export default QuestStepCreateModal;
