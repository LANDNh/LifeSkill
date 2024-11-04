import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from 'socket.io-client';
import { fetchPrivate, sendMessage, getPrivateMessages } from "../../store/chatReducer";

import './PrivateChat.css';

const socket = io('http://localhost:8000', {
    withCredentials: true,
});

const PrivateChatModal = ({ senderId, receiverId, senderCharacter, receiverCharacter }) => {
    const dispatch = useDispatch();
    const messages = useSelector(state => getPrivateMessages(state, senderId, receiverId));
    const [message, setMessage] = useState('');

    console.log(messages)

    useEffect(() => {
        socket.emit('joinPrivateChat', { senderId, receiverId });
        dispatch(fetchPrivate(senderId, receiverId));

        socket.on('sendPrivateMessage', (messageData) => {
            dispatch(sendMessage(messageData));
            socket.to(messageData.receiverId).emit('sendPrivateMessage', messageData);
        });
        return () => {
            socket.off('sendPrivateMessage');
        };
    }, [dispatch, senderId, receiverId]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = { senderId, receiverId, message };
            socket.emit('sendPrivateMessage', messageData);
            dispatch(sendMessage(messageData));
            dispatch(fetchPrivate(senderId, receiverId));
            setMessage('');
        }
    };

    return (
        <div className="private-message-modal">
            <div className="private-message-log">
                {messages && messages.length > 0 ? (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className="private-message"
                        >
                            <b>{msg.senderId === senderId ? `${senderCharacter.name}` : `${receiverCharacter.name}`}:</b> {msg.message}
                        </div>
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
            </div>
            <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default PrivateChatModal;
