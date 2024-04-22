import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        let formErrors = {};

        if (password !== confirmPassword) {
            formErrors.confirmPassword = 'Confirm Password field must match the Password field'
        }

        return dispatch(
            sessionActions.signUpUser({
                username,
                email,
                firstName,
                lastName,
                password
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

    const disableSignup = {}
    if (!firstName ||
        !lastName ||
        !email ||
        !username ||
        username.length < 4 ||
        !password ||
        password.length < 6 ||
        !confirmPassword) {
        disableSignup.disabled = true;
    } else {
        disableSignup.disabled = false;
    }

    return (
        <div className='signup-modal'>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label className='signup-input'>

                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder='First Name'
                        required
                    />
                </label>
                {errors.firstName && <p className='signup-error'>{errors.firstName}</p>}
                <label className='signup-input'>

                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder='Last Name'
                        required
                    />
                </label>
                {errors.lastName && <p className='signup-error'>{errors.lastName}</p>}
                <label className='signup-input'>

                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                        required
                    />
                </label>
                {errors.email && <p className='signup-error'>{errors.email}</p>}
                <label className='signup-input'>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                        required
                    />
                </label>
                {errors.username && <p className='signup-error'>{errors.username}</p>}
                <label className='signup-input'>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        required
                    />
                </label>
                {errors.password && <p className='signup-error'>{errors.password}</p>}
                <label className='signup-input'>

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder='Confirm Password'
                        required
                    />
                </label>
                {errors.confirmPassword && <p className='signup-error'>{errors.confirmPassword}</p>}
                <button
                    className='signup-submit'
                    type="submit"
                    {...disableSignup}
                >Sign Up</button>
            </form>
        </div>
    );
}

export default SignupFormModal;
