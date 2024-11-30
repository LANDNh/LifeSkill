import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../context/socket";
import { fetchPrivate, sendMessage, getPrivateMessages } from "../../store/chatReducer";
import './PrivateChat.css';

const PrivateChatModal = ({ senderId, receiverId, senderCharacter, receiverCharacter }) => {
    const dispatch = useDispatch();
    const messages = useSelector(state => getPrivateMessages(state, senderId, receiverId));
    const messageLogRef = useRef(null);
    const scrollAnchorRef = useRef(null);
    const [message, setMessage] = useState('');
    const [isAtBottom, setIsAtBottom] = useState(true);

    useEffect(() => {
        socket.emit('joinPrivateChat', { senderId, receiverId });

        const messageListener = (messageData) => {
            if (!messageData.id || messageData.id === undefined) return;

            dispatch(sendMessage(messageData, true));
        };

        dispatch(fetchPrivate(senderId, receiverId));

        socket.on('sendPrivateMessage', messageListener);

        return () => {
            socket.off('sendPrivateMessage', messageListener);
        };
    }, [dispatch, senderId, receiverId]);

    // Scroll to bottom when a new message is sent but only when already at bottom
    useEffect(() => {
        if (isAtBottom && scrollAnchorRef.current) {
            scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isAtBottom]);

    const handleScroll = () => {
        if (messageLogRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messageLogRef.current;
            const threshold = 20;
            const atBottom = scrollTop + clientHeight >= scrollHeight - threshold;
            setIsAtBottom(atBottom);
        }
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = { senderId, receiverId, message };

            socket.emit('sendPrivateMessage', messageData);

            setMessage('');
        }
    };

    return (
        <div className="private-message-modal">
            <h1 className="chat-name">{senderCharacter.name} & {receiverCharacter.name} Chat</h1>
            <div className="private-message-log-container">
                <div
                    className="private-message-log"
                    ref={messageLogRef}
                    onScroll={handleScroll}
                >
                    {messages && messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div
                                key={msg.id || `${msg.senderId}-${msg.timestamp || index}`}
                                className="private-message"
                            >
                                <b>{msg.senderId === senderId ? `${senderCharacter.name}` : `${receiverCharacter.name}`}:</b> {msg.message}
                            </div>
                        ))
                    ) : (
                        <p className="no-messages">No messages yet.</p>
                    )}
                    <div ref={scrollAnchorRef}></div>
                </div>
            </div>
            <div className="message-input">
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                ></textarea>
                <button onClick={handleSendMessage}><i className="fa-regular fa-circle-right"></i></button>
            </div>
        </div>
    );
};

export default PrivateChatModal;
