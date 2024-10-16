import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProfileButton from './ProfileButton';
import NavsButton from './NavsButton';
import './Navigation.css';

const validTabs = ['shop', 'users', 'friends', 'character']

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const [isSticky, setIsSticky] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth <= 775);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const activeTabFromQuery = queryParams.get('tab');
    const [activeTab, setActiveTab] = useState(
        validTabs.includes(activeTabFromQuery) ? activeTabFromQuery : null
    );

    const toggleSticky = () => {
        setIsSticky(!isSticky);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsScreenSmall(window.innerWidth <= 775);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
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
                    {isScreenSmall ? (
                        <>
                            <li
                                onClick={() => setActiveTab(null)}
                                className='small-home'
                            >
                                <NavLink to="/">
                                    <img src="https://lifeskill-bucket.s3.amazonaws.com/images/LifeSkill-logo.png" alt="LifeSkill" />
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <li
                            onClick={() => setActiveTab(null)}
                            className='home'
                        >
                            <NavLink to="/">
                                <img src="https://lifeskill-bucket.s3.amazonaws.com/images/LifeSkill-home.png" alt="LifeSkill" />
                            </NavLink>
                        </li>
                    )}
                    {isLoaded && (
                        <>
                            {isScreenSmall ? (
                                <>
                                    <li
                                        className='nav-items'
                                        id='nav'
                                    >
                                        <NavsButton user={sessionUser} isScreenSmall={isScreenSmall} />
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li
                                        onClick={() => setActiveTab('shop')}
                                        className={activeTab === 'shop' ? 'shop-nav active' : 'shop-nav'}
                                    >
                                        <NavLink to='/items' className='tab-link'>
                                            Item Shop
                                        </NavLink>
                                    </li>
                                    <li
                                        onClick={() => setActiveTab('users')}
                                        className={activeTab === 'users' ? 'users-nav active' : 'users-nav'}
                                    >
                                        <NavLink to='/characters' className='tab-link'>
                                            Find Friends
                                        </NavLink>
                                    </li>
                                    <li
                                        onClick={() => setActiveTab('friends')}
                                        className={activeTab === 'friends' ? 'friends-nav active' : 'friends-nav'}
                                    >
                                        <NavLink to='/friends' className='tab-link'>
                                            Friends List
                                        </NavLink>
                                    </li>
                                    <li
                                        onClick={() => setActiveTab('character')}
                                        className={activeTab === 'character' ? 'character-nav active' : 'character-nav'}
                                    >
                                        <NavLink to="/characters/current" className='tab-link'>
                                            Character
                                        </NavLink>
                                    </li>
                                    <li className='profile'>
                                        <ProfileButton user={sessionUser} />
                                    </li>
                                </>
                            )}
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
