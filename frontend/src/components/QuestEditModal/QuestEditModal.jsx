import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './QuestEdit.css'

import { modifyQuest, fetchQuest } from '../../store/questReducer';

function QuestEditModal({ quest }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    useEffect(() => {
        dispatch(fetchQuest(quest.id));
    }, [dispatch, quest.id]);

    const [title, setTitle] = useState(quest.title || "");
    const [description, setDescription] = useState(quest.description || "");
    const [type, setType] = useState(quest.type || "");
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        let formErrors = {};

        return dispatch(
            modifyQuest({
                id: quest.id,
                title,
                description,
                type,
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

    const questTypes = {
        'none': 'None',
        'daily': 'Daily',
        'weekly': 'Weekly',
        'monthly': 'Monthly'
    };

    return (
        <div className='edit-quest-modal'>
            <h1>Edit Your Quest</h1>
            <form onSubmit={handleSubmit}>
                <label className='edit-quest-input'>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Title'
                        required
                    />
                </label>
                {errors.title && <p className='edit-quest-error'>{errors.title}</p>}
                <label className='edit-quest-input'>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Add your description (1-200 characters) here...'
                        required
                    ></textarea>
                </label>
                {errors.status && <p className='edit-quest-error'>{errors.status}</p>}
                <label className='edit-quest-input'>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="">Select a quest type</option>
                        {Object.entries(questTypes).map(([val, type]) => (
                            <option key={val} value={val}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>
                {errors.type && <p className='edit-quest-error'>{errors.type}</p>}
                <button
                    className='edit-quest-submit'
                    type='submit'
                    disabled={!title || !description || !type}
                >Edit Quest</button>
            </form>
        </div>
    );
}

export default QuestEditModal;
