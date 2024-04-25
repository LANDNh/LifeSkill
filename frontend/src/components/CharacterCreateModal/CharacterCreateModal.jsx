import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './CharacterCreate.css'

import { createCharacter } from '../../store/characterReducer';

function CharacterCreateModal() {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [name, setName] = useState(sessionUser.username);
    const [skin, setSkin] = useState(1);
    const [eyes, setEyes] = useState(1);
    const [status, setStatus] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        let formErrors = {};

        return dispatch(
            createCharacter({
                name,
                skin,
                eyes,
                status
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

    const skinColorOptions = {
        1: 'White',
        2: 'Tan',
        3: 'Brown'
    };

    const eyeColorOptions = {
        1: 'Brown',
        2: 'Blue',
        3: 'Green'
    };

    const handleSkinChange = (e) => {
        setSkin(parseInt(e.target.value, 10));
    };

    const handleEyesChange = (e) => {
        setEyes(parseInt(e.target.value, 10));
    };

    return (
        <div className='create-character-modal'>
            <h1>Create Your Character</h1>
            <form onSubmit={handleSubmit}>
                <label className='create-character-input'>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Name'
                        required
                    />
                </label>
                {errors.name && <p className='create-character-error'>{errors.name}</p>}
                <label className='create-character-input'>
                    <select
                        value={skin}
                        onChange={handleSkinChange}
                        required
                    >
                        <option value="">Select a skin color</option>
                        {Object.entries(skinColorOptions).map(([val, color]) => (
                            <option key={val} value={val}>
                                {color}
                            </option>
                        ))}
                    </select>
                </label>
                {errors.skin && <p className='create-character-error'>{errors.skin}</p>}
                <label className='create-character-input'>
                    <select
                        value={eyes}
                        onChange={handleEyesChange}
                        required
                    >
                        <option value="">Select an eye color</option>
                        {Object.entries(eyeColorOptions).map(([val, color]) => (
                            <option key={val} value={val}>
                                {color}
                            </option>
                        ))}
                    </select>
                </label>
                {errors.eyes && <p className='create-character-error'>{errors.eyes}</p>}
                <label className='create-character-input'>
                    <textarea
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder='Add your status (20-200 characters) here...'
                    ></textarea>
                </label>
                {errors.status && <p className='create-character-error'>{errors.status}</p>}
                <button
                    className='create-character-submit'
                    type='submit'
                >Create Character</button>
            </form>
        </div>
    );
}

export default CharacterCreateModal;
