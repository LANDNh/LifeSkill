import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeQuest } from "../../store/questReducer";
import './QuestDelete.css';

const QuestDeleteModal = ({ quest }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        return dispatch(removeQuest(quest.id))
            .then(closeModal)
    }

    return (
        <div className="delete-quest-modal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this quest?</p>
            <p className="delete-quest-warning">Any unfinished quest step XP or quest coins will NOT be rewarded.</p>
            <div className="delete-quest-buttons">
                <button className="delete-quest-submit" onClick={handleDelete}>Yes (Delete Quest)</button>
                <button className="delete-quest-cancel" onClick={closeModal}>No (Keep Quest)</button>
            </div>
        </div>
    )
};

export default QuestDeleteModal;
