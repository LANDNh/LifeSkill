import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const [isSticky, setIsSticky] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleSticky = () => {
        setIsSticky(!isSticky);
    };

    // Track scroll movement to toggle opacity of .show element
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!sessionUser) {
        return null
    }

    return (
        <>
            <div className={`navigation-container ${isSticky ? 'sticky' : ''}`}>
                <ul className='navbar'>
                    <li className='home'>
                        <NavLink to="/">
                            <img src="/images/LifeSkill-home.png" alt="LifeSkill" />
                        </NavLink>
                    </li>
                    {isLoaded && (
                        <>
                            <li className='shop-nav'>
                                <NavLink to='/items' className='tab-link'>
                                    Item Shop
                                </NavLink>
                            </li>
                            <li className='users-nav'>
                                <NavLink to='/characters' className='tab-link'>
                                    Find Friends
                                </NavLink>
                            </li>
                            <li className='friends-nav'>
                                <NavLink to='/friends' className='tab-link'>
                                    Friends List
                                </NavLink>
                            </li>
                            <li className='character-nav'>
                                <NavLink to="/characters/current" className='tab-link'>
                                    Character
                                </NavLink>
                            </li>
                            <li className='profile'>
                                <ProfileButton user={sessionUser} />
                            </li>
                        </>
                    )}
                </ul>
                {isSticky && (
                    <div
                        className='hide toggle-nav'
                        onClick={toggleSticky}
                    >
                        <i className="fa-solid fa-chevron-up"></i>
                    </div>
                )}
            </div>
            {!isSticky && (
                <div
                    className={`show toggle-nav ${isScrolled ? 'scrolled' : ''}`}
                    onClick={toggleSticky}
                >
                    <i className="fa-solid fa-chevron-down"></i>
                </div>
            )}
        </>
    );
}

export default Navigation;
