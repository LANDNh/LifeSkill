import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

import * as sessionActions from '../../store/session';
import './LoginForm.css';

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.userLogin({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    setErrors(data.errors);
                }
            });
    };

    const demoLogin = () => {
        return dispatch(sessionActions.userLogin({
            credential: 'Demo-lition',
            password: 'password'
        }))
            .then(closeModal)
    };

    const googleLogin = () => {
        window.location.href = '/api/session/google';
    };

    const disableLogin = {}
    if (!credential ||
        credential.length < 4 ||
        !password ||
        password.length < 6) {
        disableLogin.disabled = true;
    } else {
        disableLogin.disabled = false;
    }

    return (
        <div className='login-modal'>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label className='login-input'>
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        placeholder='Username or Email'
                        required
                    />
                </label>
                <label className='login-input'>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        required
                    />
                </label>
                {errors.credential && <p className='login-error'>{errors.credential}</p>}
                <button
                    className='login-submit'
                    type="submit"
                    {...disableLogin}
                >Log In</button>
                <button className='demo login-submit' onClick={demoLogin}>Demo User</button>
                <button className='google-login login-submit' onClick={googleLogin}>Log In with Google</button>
            </form>
        </div>
    );
}

export default LoginFormModal;
