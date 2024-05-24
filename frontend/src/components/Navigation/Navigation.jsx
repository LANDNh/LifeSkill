import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    if (!sessionUser) {
        return null
    }

    return (
        <ul className='navbar'>
            <li className='home'>
                <NavLink to="/">
                    <img src="/images/LifeSkill-home.png" alt="LifeSkill" />
                </NavLink>
            </li>
            {isLoaded && (
                <>
                    <li className='shop-nav'
                        onClick={() => window.alert('Coming soon!')}
                    >
                        Item Shop
                    </li>
                    <li className='users-nav'>
                        <NavLink to='/characters'>
                            Find Friends
                        </NavLink>
                    </li>
                    <li className='friends-nav'
                        onClick={() => window.alert('Coming soon!')}
                    >
                        Friends List
                    </li>
                    <li className='character-nav'>
                        <NavLink to="/characters/current">
                            Character
                        </NavLink>
                    </li>
                    <li className='profile'>
                        <ProfileButton user={sessionUser} />
                    </li>
                </>
            )}
        </ul>
    );
}

export default Navigation;
