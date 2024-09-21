import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ItemShop.css';

import { fetchItems, selectAllItems, purchaseItem } from '../../store/itemReducer';
import ItemErrorModal from './ItemErrorModal';
import { useModal } from '../../context/Modal';

function ItemShopPage() {
    const { setModalContent } = useModal();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const items = useSelector(selectAllItems);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);

    if (!sessionUser) return <Navigate to='/' replace={true} />;

    return (
        <>
            <div className='items-list-all'>
                <h1 className='item-limited'>
                    <i className="fa-solid fa-triangle-exclamation"></i> indicates a limited item!
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
                                        <div className='pic-container'>
                                            <img className='item-pic' src={url} alt={`${item.description}`} />
                                        </div>
                                    )}
                                    <p className='item-level'>Level: {item.levelRequirement}</p>
                                    <p className='item-type'>Type: {item.type[0].toUpperCase() + item.type.slice(1)}</p>
                                </div>
                                <div className='item-tile-info'>
                                    <p className='item-description'>{item.description}</p>
                                    <p className='item-price'><i className="fa-solid fa-cedi-sign"></i>: {item.price}</p>
                                </div>
                                <button
                                    className='buy-item'
                                    onClick={e => {
                                        e.preventDefault();
                                        let formErrors = {};

                                        dispatch(purchaseItem(item.id))
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
                                    Buy
                                    {item.available && (
                                        <p className='item-available'>
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                        </p>
                                    )}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div >
        </>
    )
}

export default ItemShopPage;
