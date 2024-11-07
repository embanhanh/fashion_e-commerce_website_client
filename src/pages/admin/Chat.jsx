import { useState, useEffect, useRef } from 'react'
import { db } from '../../firebase.config'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import { fetchClients } from '../../redux/slices/userSlice'
import defaultAvatar from '../../assets/image/default/default-avatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import '../../components/Chat.scss'

function Chat() {
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef(null)
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchClients({ userIds: [] }))
    }, [])

    // Lấy danh sách chat từ Firestore
    useEffect(() => {
        const q = query(collection(db, 'chatAIHistory'), orderBy('updatedAt', 'desc'))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = []
            snapshot.forEach((doc) => {
                chatList.push({ id: doc.id, ...doc.data() })
            })
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

    // Gửi tin nhắn
    const handleSendMessage = async (e) => {
        e.preventDefault()
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
                    user: {
                        _id: user._id,
                        name: user.name,
                        role: 'admin',
                        avatar: user.urlImage,
                        email: user.email,
                    },
                }),
                updatedAt: serverTimestamp(),
            })
            setNewMessage('')
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error)
        }
    }

    return (
        <div className="chat-admin-container">
            {/* Danh sách chat */}
            <div className="chat-list">
                <h5 className="chat-list-header">Danh sách chat</h5>
                <div className={`chat-item active`}>
                    <img src={defaultAvatar} alt="avatar" className="chat-avatar" />
                    <div className="chat-info">
                        <div className="chat-name">{'Khách hàng'}</div>
                        <div className="chat-last-message">{'Chưa có tin nhắn'}</div>
                    </div>
                </div>
                <div className={`chat-item`}>
                    <img src={defaultAvatar} alt="avatar" className="chat-avatar" />
                    <div className="chat-info">
                        <div className="chat-name">{'Khách hàng'}</div>
                        <div className="chat-last-message">{'Chưa có tin nhắn'}</div>
                    </div>
                </div>
                <div className={`chat-item`}>
                    <img src={defaultAvatar} alt="avatar" className="chat-avatar" />
                    <div className="chat-info">
                        <div className="chat-name">{'Khách hàng'}</div>
                        <div className="chat-last-message">{'Chưa có tin nhắn'}</div>
                    </div>
                </div>
            </div>

            {/* Khung chat */}
            <div className="chat-window">
                <>
                    <div className="chat-header">
                        <img src={defaultAvatar} alt="avatar" className="chat-avatar" />
                        <div className="chat-name">{'Khách hàng'}</div>
                    </div>

                    <div className="messages-container">
                        <div className={`message admin`}>
                            <div className="message-content">{'Tin nhắn'}</div>
                            <div className="message-time">{new Date().toLocaleTimeString()}</div>
                        </div>
                        <div className={`message user`}>
                            <div className="message-content">{'Tin nhắn'}</div>
                            <div className="message-time">{new Date().toLocaleTimeString()}</div>
                        </div>
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="message-input d-flex align-items-center">
                        <div className="input-form d-flex align-items-center w-100 rounded-pill">
                            <input type="text" className="input-text w-100 rounded-pill ps-4" placeholder="Nhập tin nhắn..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                        </div>
                        <div className="send-btn">
                            <FontAwesomeIcon icon={faPaperPlane} className="hover-icon fs-2 py-3 px-4 rounded-pill ms-3" />
                        </div>
                    </div>
                </>
            </div>
        </div>
    )
}

export default Chat
