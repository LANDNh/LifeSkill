import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import './ItemShop.css';

import { fetchItems, selectAllItems } from '../../store/itemReducer';

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
                        return (
                            <div
                                className='item-tile'
                                key={item.id}
                            >
                                <div className='item-tile-info'>
                                    <p>Type: {item.type}</p>
                                    <p>{item.description}</p>
                                    <p>{item.color}</p>
                                    <p>Level: {item.levelRequirement}</p>
                                    <p><i className="fa-solid fa-cedi-sign"></i>: {item.price}</p>
                                    <p>{item.available && (
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                    )}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default ItemShopPage;
