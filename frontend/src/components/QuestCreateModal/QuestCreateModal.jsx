import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './QuestCreate.css'

import { createQuest } from '../../store/questReducer';

function QuestCreateModal() {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        let formErrors = {};

        return dispatch(
            createQuest({
                title,
                description,
                type
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
        <div className='create-quest-modal'>
            <h1>Create A New Quest</h1>
            <form onSubmit={handleSubmit}>
                <label className='create-quest-input'>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Title'
                        required
                    />
                </label>
                {errors.title && <p className='create-quest-error'>{errors.title}</p>}
                <label className='create-quest-input'>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Add your description (1-200 characters) here...'
                        required
                    ></textarea>
                </label>
                {errors.status && <p className='create-quest-error'>{errors.status}</p>}
                <label className='create-quest-input'>
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
                {errors.type && <p className='create-quest-error'>{errors.type}</p>}
                <button
                    className='create-quest-submit'
                    type='submit'
                >Create Quest</button>
            </form>
        </div>
    );
}

export default QuestCreateModal;
