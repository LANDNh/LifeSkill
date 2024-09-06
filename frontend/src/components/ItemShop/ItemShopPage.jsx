import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import './ItemShop.css';

import { fetchItems, selectAllItems, purchaseItem } from '../../store/itemReducer';

function ItemShopPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const items = useSelector(selectAllItems);

    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    return (
        <>
            <div className='items-list-all'>
                <div className='item-list-container'>
                    {items && items.map(item => {
                        const url = item.url;
                        return (
                            <div
                                className='item-tile'
                                key={item.id}
                            >
                                {url && (
                                    <img className='item-pic' src={url} alt={`${item.description}`} />
                                )}
                                <div className='item-tile-info'>
                                    <p className='item-type'>Type: {item.type}</p>
                                    <p className='item-description'>{item.description}</p>
                                    <p className='item-color'>{item.color}</p>
                                    <p className='item-level'>Level: {item.levelRequirement}</p>
                                    <p className='item-price'><i className="fa-solid fa-cedi-sign"></i>: {item.price}</p>
                                    {item.available && (
                                        <p className='item-available'>
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                        </p>
                                    )}
                                </div>
                                <button
                                    className='buy-item'
                                    onClick={e => {
                                        e.preventDefault();
                                        dispatch(purchaseItem(item.id));
                                    }}
                                >
                                    Buy
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default ItemShopPage;
