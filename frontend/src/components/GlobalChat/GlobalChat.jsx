import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../context/socket";
import { fetchGlobal, sendMessage, getGlobalMessages } from "../../store/chatReducer";
import './GlobalChat.css';

const GlobalChat = ({ currentCharacter }) => {
    const dispatch = useDispatch();
    const messages = useSelector(getGlobalMessages);
    const messageLogRef = useRef(null);
    const scrollAnchorRef = useRef(null);
    const [message, setMessage] = useState('');
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(false);

    useEffect(() => {
        socket.emit('joinGlobalChat');

        const messageListener = (messageData) => {
            if (!messageData.id || messageData.id === undefined) return;

            dispatch(sendMessage(messageData, true));

            if (!isVisible) {
                setUnreadMessages(true);
            }
        };

        dispatch(fetchGlobal());

        socket.on('recievedGlobalMessage', messageListener);

        return () => {
            socket.off('recievedGlobalMessage', messageListener);
        };
    }, [dispatch]);

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
            const messageData = { senderId: currentCharacter.id, receiverId: null, message };

            socket.emit('sendGlobalMessage', messageData);

            setMessage('');
        }
    };

    const toggleChat = () => {
        setIsVisible(!isVisible);

        setUnreadMessages(false);
    };

    return (
        <>
            <div
                className={`global-chat-header ${isVisible ? "visible" : ""}`}
                onClick={toggleChat}
            >
                <span>{isVisible ? "Hide Chat" : "Show Chat"}</span>
            </div>
            {unreadMessages && !isVisible && (
                <div className="chat-notification">
                    <i className="fa-solid fa-paper-plane"></i>
                </div>
            )}
            <div className={`global-chat-container ${isVisible ? "visible" : ""}`}>
                <div className="global-message-log-container">
                    <div
                        className="global-message-log"
                        ref={messageLogRef}
                        onScroll={handleScroll}
                    >
                        {messages && messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div
                                    key={msg.id || `${msg.senderId}-${msg.timestamp || index}`}
                                    className="global-message"
                                >
                                    <b>{msg.senderName || `User ${msg.senderId}`}:</b> {msg.message}
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
        </>
    );
};

export default GlobalChat;
