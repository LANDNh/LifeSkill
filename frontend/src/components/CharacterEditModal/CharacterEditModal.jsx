import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './CharacterEdit.css';

import { fetchUserCharacter, modifyCharacter } from '../../store/characterReducer';

function CharacterEditModal({ character }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [name, setName] = useState(character.name || sessionUser.username);
    const [skin, setSkin] = useState(character.skin || 1);
    const [eyes, setEyes] = useState(character.eyes || 1);
    const [status, setStatus] = useState(character.status || "");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchUserCharacter());
    }, [dispatch])

    const handleSubmit = (e) => {
        e.preventDefault();
        let formErrors = {};

        return dispatch(
            modifyCharacter({
                id: character.id,
                name,
                skin,
                eyes,
                status
            })
        )
            .then(() => {
                closeModal();
                window.location.reload();
            })
            .catch(async res => {
                const data = await res.json();
                if (data && data?.errors) {
                    formErrors = { ...errors, ...data.errors }
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
        <div className='edit-character-modal'>
            <h1>Edit Your Character</h1>
            <form onSubmit={handleSubmit}>
                <label className='edit-character-input'>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Name'
                        required
                    />
                </label>
                {errors.name && <p className='edit-character-error'>{errors.name}</p>}
                <label className='edit-character-input'>
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
                {errors.skin && <p className='edit-character-error'>{errors.skin}</p>}
                <label className='edit-character-input'>
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
                {errors.eyes && <p className='edit-character-error'>{errors.eyes}</p>}
                <label className='edit-character-input'>
                    <textarea
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder='Add your status (20-200 characters) here...'
                    ></textarea>
                </label>
                {errors.status && <p className='edit-character-error'>{errors.status}</p>}
                <button
                    className='edit-character-submit'
                    type='submit'
                >Edit Character</button>
            </form>
        </div>
    );
}

export default CharacterEditModal;
