import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './QuestStepEdit.css'

import { modifyQuestStep } from '../../store/questStepReducer';

function QuestStepEditModal({ questStep }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [title, setTitle] = useState(questStep.title || "");
    const [notes, setNotes] = useState(questStep.notes || "");
    const [difficulty, setDifficulty] = useState(questStep.difficulty || 1);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        let formErrors = {};

        return dispatch(
            modifyQuestStep({
                id: questStep.id,
                title,
                notes,
                difficulty,
                complete: false
            })
        )
            .then(closeModal)
            .catch(async res => {
                const data = await res.json();
                if (data && data?.errors) {
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

    const disableQuestStepEdit = {}
    if (!title ||
        !notes ||
        !difficulty) {
        disableQuestStepEdit.disabled = true;
    } else {
        disableQuestStepEdit.disabled = false;
    }

    return (
        <div className='edit-quest-step-modal'>
            <h1>Edit A Quest Step</h1>
            <form onSubmit={handleSubmit}>
                <label className='edit-quest-step-input'>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Title'
                        required
                    />
                </label>
                {errors.title && <p className='edit-quest-step-error'>{errors.title}</p>}
                <label className='edit-quest-step-input'>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder='Add your notes (1-200 characters) here...'
                        required
                    ></textarea>
                </label>
                {errors.notes && <p className='edit-quest-step-error'>{errors.notes}</p>}
                <label className='edit-quest-step-input'>
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
                {errors.difficulty && <p className='edit-quest-step-error'>{errors.difficulty}</p>}
                <button
                    className='edit-quest-step-submit'
                    type='submit'
                    {...disableQuestStepEdit}
                >Edit Quest Step</button>
            </form>
        </div>
    );
}

export default QuestStepEditModal;
