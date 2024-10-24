import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeQuestStep } from "../../store/questStepReducer";
import './QuestStepDelete.css';
import { fetchQuest } from "../../store/questReducer";

const QuestStepDeleteModal = ({ questStep }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        return dispatch(removeQuestStep(questStep.id))
            .then(() => {
                dispatch(fetchQuest(questStep.questId));
                closeModal();
            })
    }

    return (
        <div className="delete-quest-step-modal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this quest step?</p>
            <p className="delete-quest-step-warning">Any unfinished quest step XP will NOT be rewarded.</p>
            <div className="delete-quest-step-buttons">
                <button className="delete-quest-step-submit" onClick={handleDelete}>Yes (Delete Step)</button>
                <button className="delete-quest-step-cancel" onClick={closeModal}>No (Keep Step)</button>
            </div>
        </div>
    )
};

export default QuestStepDeleteModal;
