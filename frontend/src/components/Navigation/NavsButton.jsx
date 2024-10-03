import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import ProfileButton from './ProfileButton';

function NavsButton({ user, isScreenSmall }) {
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const ulClassName = "nav-dropdown" + (showMenu ? "" : " hidden");

    const closeMenu = () => setShowMenu(false);

    return (
        <>
            <button
                className='small-nav-dropdown'
                onClick={toggleMenu}>
                <i className="fa-solid fa-bars"></i>
            </button>
            <ul className={ulClassName} ref={ulRef}>
                <>
                    <li
                        className='shop-nav'
                        onClick={closeMenu}
                    >
                        <NavLink to='/items' className='tab-link'>
                            Item Shop
                        </NavLink>
                    </li>
                    <li
                        className='users-nav'
                        onClick={closeMenu}
                    >
                        <NavLink to='/characters' className='tab-link'>
                            Find Friends
                        </NavLink>
                    </li>
                    <li
                        className='friends-nav'
                        onClick={closeMenu}
                    >
                        <NavLink to='/friends' className='tab-link'>
                            Friends List
                        </NavLink>
                    </li>
                    <li
                        className='character-nav'
                        onClick={closeMenu}
                    >
                        <NavLink to="/characters/current" className='tab-link'>
                            Character
                        </NavLink>
                    </li>
                </>
            </ul>
            <li className='small-profile'>
                <ProfileButton user={user} isScreenSmall={isScreenSmall} />
            </li>
        </>
    );
}

export default NavsButton;
