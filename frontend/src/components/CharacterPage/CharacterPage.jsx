import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { fetchUserCharacter, fetchCharacter, selectCharacter, modifyCharacter } from '../../store/characterReducer';
import { useEffect, useState, useRef } from 'react';
import './CharacterPage.css';

import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton';
import CharacterCreateModal from '../CharacterCreateModal';
import CharacterEditModal from '../CharacterEditModal';
import CharacterDeleteModal from '../CharacterDeleteModal';

export const characterPic = character => {
    let charPic;

    if (character) {
        switch (character.skin) {
            case 2:
                switch (character.eyes) {
                    case 2:
                        charPic = 'https://lifeskill-bucket.s3.amazonaws.com/images/char-tan-blue.png';
                        break;
                    case 3:
                        charPic = 'https://lifeskill-bucket.s3.amazonaws.com/images/char-tan-green.png';
                        break;
                    default:
                        charPic = 'https://lifeskill-bucket.s3.amazonaws.com/images/char-tan-brown.png';
                }
                break;
            case 3:
                switch (character.eyes) {
                    case 2:
                        charPic = 'https://lifeskill-bucket.s3.amazonaws.com/images/char-brown-blue.png';
                        break;
                    case 3:
                        charPic = 'https://lifeskill-bucket.s3.amazonaws.com/images/char-brown-green.png';
                        break;
                    default:
                        charPic = 'https://lifeskill-bucket.s3.amazonaws.com/images/char-brown-brown.png';
                }
                break;
            default:
                switch (character.eyes) {
                    case 2:
                        charPic = 'https://lifeskill-bucket.s3.amazonaws.com/images/char-white-blue.png';
                        break;
                    case 3:
                        charPic = 'https://lifeskill-bucket.s3.amazonaws.com/images/char-white-green.png';
                        break;
                    default:
                        charPic = 'https://lifeskill-bucket.s3.amazonaws.com/images/char-white-brown.png';
                }
        }
    }
    return charPic;
};

function CharacterPage() {
    const { setModalContent } = useModal();
    const dispatch = useDispatch();
    const { characterId } = useParams();
    const location = useLocation();
    const dropdownRefs = useRef({});
    const sessionUser = useSelector(state => state.session.user);
    const isCurrentUserCharacter = location.pathname === '/characters/current';
    const character = useSelector(state => selectCharacter(state, characterId || (isCurrentUserCharacter ? 'current' : null)));
    const [isLoading, setIsLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState({});
    const [equippedItems, setEquippedItems] = useState({});

    useEffect(() => {
        if (isCurrentUserCharacter) {
            dispatch(fetchUserCharacter())
                .finally(() => setIsLoading(false));
        } else if (characterId) {
            dispatch(fetchCharacter(characterId))
                .finally(() => setIsLoading(false));
        }
    }, [dispatch, characterId, isCurrentUserCharacter]);

    useEffect(() => {
        if (!isLoading && !character && isCurrentUserCharacter) {
            setModalContent(<CharacterCreateModal />);
        }
    }, [character, isLoading, setModalContent, isCurrentUserCharacter]);

    useEffect(() => {
        if (character) {
            // Initialize equipped items state
            const initialEquippedItems = {};
            character.CharacterCustomizations.forEach(customization => {
                if (customization.equipped) {
                    initialEquippedItems[customization.CustomizationItem.type] = customization;
                }
            });
            setEquippedItems(initialEquippedItems);
        }
    }, [character]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const dropdownKeys = Object.keys(dropdownVisible);
            for (let key of dropdownKeys) {
                const dropdownElement = dropdownRefs.current[key];
                if (dropdownVisible[key] && dropdownElement && !dropdownElement.contains(e.target)) {
                    setDropdownVisible(prev => ({ ...prev, [key]: false }));
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownVisible]);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    const handleEquipCustomization = (type, customization) => {
        const customPayload = character.CharacterCustomizations.map((c) => {
            if (c.CustomizationItem.type === type) {
                return { ...c, equip: c.id === customization.id };
            }
            return c;
        });

        dispatch(
            modifyCharacter({
                id: character.id,
                name: character.name,
                skin: character.skin,
                eyes: character.eyes,
                status: character.status,
                customizations: customPayload.map(({ id, equip }) => ({ id, equip }))
            })
        ).then(() => {
            setEquippedItems(prev => ({ ...prev, [type]: customization }));
            setDropdownVisible(prev => ({ ...prev, [type]: false }));
            dispatch(fetchUserCharacter());
        });
    };

    const toggleDropdown = (type) => {
        setDropdownVisible((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    if (character) {
        const groupedCustomizations = character.CharacterCustomizations.reduce((acc, customization) => {
            const type = customization.CustomizationItem.type;
            if (!acc[type]) acc[type] = [];
            acc[type].push(customization);
            return acc;
        }, {});

        return (
            <div className='character-page-all'>
                <div className='character-page-container'>
                    <div className='character-info'>
                        {isCurrentUserCharacter &&
                            <span className='character-edit'>
                                <OpenModalButton
                                    buttonText='Edit Character'
                                    modalComponent={<CharacterEditModal character={character} />}
                                />
                            </span>
                        }
                        <img className='character-pic' src={characterPic(character)} alt={`Character ${character.name}`} />
                        {isCurrentUserCharacter && <span className='character-delete'>
                            <OpenModalButton
                                buttonText='Delete Character'
                                modalComponent={<CharacterDeleteModal />}
                            />
                        </span>}
                        <p className='character-name'>Name: {character.name}</p>
                        <p className='character-lvl'>Level: {character.level}</p>
                        <div className='character-xp'>
                            <div className='xp-bar-fill' style={{ width: `${Math.min(character.totalXp, 100)}%` }}>
                                <span className='xp-text'>{character.totalXp} XP</span>
                            </div>
                        </div>
                        <p className='character-coins'>Coins: {character.totalCoins}</p>
                        <p className='character-status'>{character.status}</p>
                        {isCurrentUserCharacter &&
                            <div className="character-customizations">
                                <h2>Equip Customizations</h2>
                                <div className='items-container'>
                                    {Object.keys(groupedCustomizations).map((type) => {
                                        const equipped = equippedItems[type];
                                        return (
                                            <div key={type} className="customization-item">
                                                {type[0].toUpperCase() + type.slice(1)}
                                                <div className='char-item-pic-container'>
                                                    <img
                                                        className='char-item-pic'
                                                        src={equipped && equipped.CustomizationItem.url}
                                                        alt='Empty'
                                                        onClick={() => toggleDropdown(type)}>
                                                    </img>
                                                </div>
                                                {dropdownVisible[type] && (
                                                    <div
                                                        className="item-dropdown-menu"
                                                        ref={el => dropdownRefs.current[type] = el}
                                                    >
                                                        {groupedCustomizations[type].map((customization) => (
                                                            <div
                                                                className='char-item-pic-container'
                                                                key={customization.id} >
                                                                <img
                                                                    className='char-item-pic'
                                                                    src={customization.CustomizationItem.url}
                                                                    onClick={() => handleEquipCustomization(type, customization)}>
                                                                </img>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                                }
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div >
        )
    }

    return null;
}

export default CharacterPage;
