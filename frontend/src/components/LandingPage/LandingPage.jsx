import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './LandingPage.css';

import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

import logo from '/images/LifeSkill-logo.png';

function LandingPage() {
    const sessionUser = useSelector(state => state.session.user);

    if (sessionUser) return <Navigate to='/quests' replace={true} />;

    return (
        <div className='landing-page-all'>
            <div className='landing-page-container'>
                <img className='landing-page-logo' src={logo} alt="LifeSkill Logo" />
                <h1>Complete Quests, Form Habits</h1>
                <li className='landing-page-login'>
                    <p>Returning User?</p>
                    <p>Welcome Back!</p>
                    <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                    />
                </li>
                <li className='landing-page-signup'>
                    <p>New User?</p>
                    <p>Get Started!</p>
                    <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal />}
                    />
                </li>
            </div>
        </div>
    )
}

export default LandingPage;
