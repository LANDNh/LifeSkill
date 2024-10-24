import { useModal } from '../../context/Modal';
import { useEffect, useState } from 'react';
import './ItemShop.css';

function ItemErrorModal({ errors, itemId }) {
    const { closeModal } = useModal();
    const [errMessage, setErrMessage] = useState('');

    useEffect(() => {
        if (errors[itemId]) {
            setErrMessage(errors[itemId])
        }
    }, [errors, itemId]);

    return (
        <>
            <div className='item-error-container'>
                <p className='item-error-message'>{errMessage}</p>
                <button
                    className='item-error-button'
                    onClick={() => closeModal()}
                >
                    Ok
                </button>
            </div>
        </>
    )
}

export default ItemErrorModal;
