import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './QuestPage.css';

function QuestPage() {
    const sessionUser = useSelector(state => state.session.user);

    if (sessionUser) return <Navigate to='/quests' replace={true} />
}
