import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ItemShop.css';

import { fetchItems, selectAllItems, purchaseItem } from '../../store/itemReducer';
import ItemErrorModal from './ItemErrorModal';
import { useModal } from '../../context/Modal';

const validTabs = ['buy', 'sell']

function ItemShopPage() {
    const { setModalContent } = useModal();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const items = useSelector(selectAllItems);
    const [errors, setErrors] = useState({});

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const activeTabFromQuery = queryParams.get('tab');
    const [activeTab, setActiveTab] = useState(
        validTabs.includes(activeTabFromQuery) ? activeTabFromQuery : 'buy'
    );

    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    return (
        <>
            <div className='items-list-all'>
                <div className='shop-tabs'>
                    <span
                        onClick={() => setActiveTab('buy')}
                        className={activeTab === 'buy' ? 'active' : ''}
                    >
                        Buy
                    </span>
                    <span
                        onClick={() => setActiveTab('sell')}
                        className={activeTab === 'sell' ? 'active' : ''}
                    >
                        Sell
                    </span>
                </div>

                {activeTab === 'buy' && (
                    <>
                        <h1 className='item-limited'>
                            <p>
                                <i className="fa-solid fa-triangle-exclamation"></i> indicates a limited item!
                            </p>
                            <p>
                                <button
                                    id='so-example'
                                    className='buy-item'
                                    disabled={true}
                                >
                                    <p className='item-out-text'>
                                        Sold <br /> Out
                                    </p>
                                </button>
                                indicates limited item sold out!
                            </p>
                        </h1>
                        <div className='item-list-container'>
                            {items && items.map(item => {
                                const url = item.url;
                                return (
                                    <div
                                        className='item-tile'
                                        key={item.id}
                                    >
                                        <div className='item-pic-type'>
                                            {url && (
                                                <div className='item-pic-container'>
                                                    <img className='item-pic' src={url} alt={`${item.description}`} />
                                                </div>
                                            )}
                                            <p className='item-level'>Level: {item.levelRequirement}</p>
                                            <p className='item-type'>Type: {item.type[0].toUpperCase() + item.type.slice(1)}</p>
                                        </div>
                                        <div className='item-tile-info'>
                                            <p className='item-description'>{item.description}</p>
                                            {(item.available === true || item.available === null) && (
                                                <p className='item-price'><i className="fa-solid fa-cedi-sign"></i>: {item.price}</p>
                                            )}
                                        </div>
                                        <button
                                            className='buy-item'
                                            disabled={item.available !== null && item.available === false}
                                            onClick={e => {
                                                e.preventDefault();
                                                let formErrors = {};

                                                dispatch(purchaseItem(item.id))
                                                    .then(() => {
                                                        dispatch(fetchItems());
                                                    })
                                                    .catch(async res => {
                                                        const data = await res.json();
                                                        if (data && data?.message) {
                                                            formErrors = { ...errors, [item.id]: data.message };
                                                            setErrors(formErrors);
                                                            setModalContent(<ItemErrorModal errors={formErrors} itemId={item.id} />)
                                                        }
                                                    });
                                            }}
                                        >
                                            {item.available || item.available === null ? (
                                                <>
                                                    <p className='item-buy-text'>
                                                        Buy
                                                    </p>
                                                    {item.available && (
                                                        <p className='item-available'>
                                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className='item-out-text'>
                                                    Sold Out
                                                </p>
                                            )}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
                {activeTab === 'sell' && (
                    <>
                        <h1 className='item-selling'>
                            <p>
                                <button
                                    id='sell-example'
                                    className='sell-item'
                                    disabled={true}
                                >
                                    <p className='item-out-text'>
                                        Sell
                                    </p>
                                </button>
                                for half your coins back!
                                <br />
                                Selling limited items makes them available!
                            </p>
                        </h1>
                    </>
                )}
            </div >
        </>
    )
}

export default ItemShopPage;
