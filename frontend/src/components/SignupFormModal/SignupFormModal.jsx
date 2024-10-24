import { useState, useEffect } from 'react';
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
    const [firstNameValid, setFirstNameValid] = useState(false);
    const [lastNameValid, setLastNameValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [usernameValid, setUsernameValid] = useState(false);
    const [passwordLengthValid, setPasswordLengthValid] = useState(false);
    const [passwordNumberValid, setPasswordNumberValid] = useState(false);
    const [passwordSpecialValid, setPasswordSpecialValid] = useState(false);
    const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth <= 850);

    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    useEffect(() => {
        setFirstNameValid(firstName.length >= 3 && firstName.length <= 50);
        setLastNameValid(lastName.length >= 3 && lastName.length <= 50);
        setEmailValid(email.length >= 3 && email.length <= 256);
        setUsernameValid(username.length >= 4 && username.length <= 50);
        setPasswordLengthValid(password.length >= 6);
        setPasswordNumberValid(/\d/.test(password));
        setPasswordSpecialValid(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    }, [firstName, lastName, email, username, password]);

    useEffect(() => {
        const handleResize = () => {
            setIsScreenSmall(window.innerWidth <= 850);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    const renderIcon = (isValid) => {
        return isValid ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-xmark"></i>;
    };

    return (
        <div className='signup-container'>
            <div className='requirements'>
                <span className='requirement'>First Name
                    <p style={{ color: firstNameValid ? 'green' : 'red' }}>
                        {renderIcon(firstNameValid)} 3-50 characters
                    </p>
                </span>
                <span className='requirement'>Last Name
                    <p style={{ color: lastNameValid ? 'green' : 'red' }}>
                        {renderIcon(lastNameValid)} 3-50 characters
                    </p>
                </span>
                <span className='requirement'>Username
                    <p style={{ color: usernameValid ? 'green' : 'red' }}>
                        {renderIcon(usernameValid)} 4-50 characters
                    </p>
                </span>
                <span className='requirement'>Email
                    <p style={{ color: emailValid ? 'green' : 'red' }}>
                        {renderIcon(emailValid)} 3-256 characters
                    </p>
                </span>
                <span className='requirement'>Password
                    <p style={{ color: passwordLengthValid ? 'green' : 'red' }}>
                        {renderIcon(passwordLengthValid)} At least 6 characters
                    </p>
                    <p style={{ color: passwordNumberValid ? 'green' : 'red' }}>
                        {renderIcon(passwordNumberValid)} At least 1 number
                    </p>
                    <p style={{ color: passwordSpecialValid ? 'green' : 'red' }}>
                        {renderIcon(passwordSpecialValid)} At least 1 special character
                    </p>
                </span>
            </div>
            <div className='signup-modal'>
                <h1>Sign Up</h1>
                <p className='signup-title'>Please Fill Out All Fields</p>
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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Username'
                            required
                        />
                    </label>
                    {errors.username && <p className='signup-error'>{errors.username}</p>}
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
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            required
                        />
                    </label>
                    {errors.password && <p className='signup-error'>{errors.password}</p>}
                    {isScreenSmall ? (
                        <label className='signup-input'>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm Password'
                                required
                            />
                        </label>
                    ) : (
                        <label className='signup-input'>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm Password (Must Match Password)'
                                required
                            />
                        </label>
                    )}
                    {errors.confirmPassword && <p className='signup-error'>{errors.confirmPassword}</p>}
                    <button
                        className='signup-submit'
                        type="submit"
                        {...disableSignup}
                    >Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default SignupFormModal;
