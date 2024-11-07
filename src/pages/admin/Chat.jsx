import { useState, useEffect, useRef } from 'react'
import { db } from '../../firebase.config'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import defaultAvatar from '../../assets/image/default/default-avatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import '../../components/Chat.scss'
import { useNavigate } from 'react-router-dom'
function Chat() {
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef(null)
    const { user } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    // Lấy danh sách chat từ Firestore
    useEffect(() => {
        const q = query(collection(db, 'chatAIHistory'), orderBy('updatedAt', 'desc'))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('change')
            const chatList = []
            snapshot.forEach((doc) => {
                chatList.push({ id: doc.id, ...doc.data() })
            })
            console.log(chatList)
            setChats(chatList)

            // Chọn chat đầu tiên nếu chưa có chat nào được chọn
            if (!selectedChat && chatList.length > 0) {
                setSelectedChat(chatList[0])
            }
        })

        return () => unsubscribe()
    }, [])

    // Cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [selectedChat])

    useEffect(() => {
        setSelectedChat((pre) => (pre ? chats.find((chat) => chat.id === pre?.id) : chats[0]))
    }, [chats])

    // Gửi tin nhắn
    const handleSendMessage = async (e) => {
        if (!newMessage.trim() || !selectedChat) return

        try {
            const chatRef = doc(db, 'chatAIHistory', selectedChat.id)
            await updateDoc(chatRef, {
                messages: arrayUnion({
                    message: {
                        type: 'text',
                        text: newMessage,
                    },
                    timestamp: new Date().toISOString(),
                    user: null,
                }),
                updatedAt: serverTimestamp(),
            })
            setNewMessage('')
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error)
        }
    }

    const convertMessage = (message, index) => {
        if (message.message.type === 'text') {
            return (
                <div key={index} className={`message ${message.user === 'client' ? 'user' : 'admin'}`}>
                    <div className="message-content">{message.message.text}</div>
                    <div className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>
                </div>
            )
        } else if (message.message.type === 'chips') {
            return message.message.options.map((option, index) => (
                <div key={`${message.message.id}-${index}`} className={`message ${message.user === 'client' ? 'user' : 'admin'}`}>
                    <div className="message-content">{option.text}</div>
                    {index === message.message.options.length - 1 && <div className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>}
                </div>
            ))
        } else if (message.message.type === 'customCard') {
            return (
                <div key={index} className={`message ${message.user === 'client' ? 'user' : 'admin'}`}>
                    <div className="message-card-container">
                        {message.message.richElements.map((card, index) => (
                            <div
                                key={card.id}
                                className="message-card d-flex"
                                onClick={() => {
                                    navigate(card.actionLink)
                                }}
                            >
                                <img className="message-card-image" src={card.image.src.rawUrl} alt="card" />
                                <div className="message-card-content">
                                    <h5>{card.title}</h5>
                                    <p>{card.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
    }

    const convertLastMessage = (message) => {
        if (message?.message?.type === 'text') {
            return message.message.text
        } else if (message?.message?.type === 'chips') {
            return message.message.options[message.message.options.length - 1].text
        } else if (message?.message?.type === 'customCard') {
            return message.message.richElements[message.message.richElements.length - 1].title
        } else {
            return null
        }
    }

    return (
        <div className="chat-admin-container">
            {/* Danh sách chat */}
            <div className="chat-list">
                <h5 className="chat-list-header">Danh sách chat</h5>
                {chats.length > 0 &&
                    chats.map((chat) => (
                        <div key={chat.id} className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`} onClick={() => setSelectedChat(chat)}>
                            <img src={chat.user?.avatar || defaultAvatar} alt="avatar" className="chat-avatar" />
                            <div className="chat-info">
                                <div className="chat-name">{chat.user?.name || chat.user?.email?.split('@')[0] || 'Khách hàng'}</div>
                                <div className="chat-last-message">{convertLastMessage(chat.messages[chat.messages.length - 1]) || 'Chưa có tin nhắn'}</div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Khung chat */}
            <div className="chat-window">
                {selectedChat ? (
                    <>
                        <div className="chat-header">
                            <img src={selectedChat?.user?.avatar || defaultAvatar} alt="avatar" className="chat-avatar" />
                            <div className="chat-name">{selectedChat?.user?.name || selectedChat?.user?.email?.split('@')[0] || 'Khách hàng'}</div>
                        </div>

                        <div className="messages-container">
                            {selectedChat.messages.map((message, index) => convertMessage(message, index))}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="message-input d-flex align-items-center">
                            <div className="input-form d-flex align-items-center w-100 rounded-pill">
                                <input type="text" className="input-text w-100 rounded-pill ps-4" placeholder="Nhập tin nhắn..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                            </div>
                            <div className="send-btn" onClick={handleSendMessage}>
                                <FontAwesomeIcon icon={faPaperPlane} color="#4a90e2" className="hover-icon fs-2 py-3 px-4 rounded-pill ms-3" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">Chọn một cuộc trò chuyện để bắt đầu</div>
                )}
            </div>
        </div>
    )
}

export default Chat
