import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeCharacter } from "../../store/characterReducer";
import './CharacterDelete.css';

const CharacterDeleteModal = () => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        return dispatch(removeCharacter())
            .then(() => {
                closeModal();
                window.location.reload();
            })
    }

    return (
        <div className="delete-character-modal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this character?</p>
            <p className="delete-character-warning">Coins, level, xp, and equipment WILL be retained.</p>
            <div className="delete-character-buttons">
                <button className="delete-character-submit" onClick={handleDelete}>Yes (Delete Character)</button>
                <button className="delete-character-cancel" onClick={closeModal}>No (Keep Character)</button>
            </div>
        </div>
    )
};

export default CharacterDeleteModal;
