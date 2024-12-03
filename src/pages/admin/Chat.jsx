import { useState, useEffect, useRef } from 'react'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faImage, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import { db, storage } from '../../firebase.config'
import { createNewChat, markMessagesAsRead } from '../../utils/firebaseUtils'
import defaultAvatar from '../../assets/image/default/default-avatar.png'
import '../../components/Chat.scss'

function Chat() {
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const [selectedImage, setSelectedImage] = useState([])
    const [imagePreview, setImagePreview] = useState([])
    const messagesEndRef = useRef(null)
    const { user } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const { user_id } = useParams()
    const location = useLocation()
    const userData = location.state?.user
    const fileInputRef = useRef(null)

    // Lấy danh sách chat từ Firestore
    useEffect(() => {
        const q = query(collection(db, 'chatAIHistory'), orderBy('updatedAt', 'desc'))

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const chatList = []
            snapshot.forEach((doc) => {
                chatList.push({ id: doc.id, ...doc.data() })
            })
            setChats(chatList)

            // Chọn chat đầu tiên nếu chưa có chat nào được chọn
            if (user_id && chatList.length > 0) {
                const targetChat = chatList.find((chat) => chat.user?._id === user_id)
                if (targetChat) {
                    setSelectedChat(targetChat)
                    // Cập nhật URL với user_id của chat được chọn
                    navigate(`/seller/chat/${user_id}`, { replace: true })
                    setTimeout(() => {
                        markMessagesAsRead(user_id)
                    }, 1000)
                } else if (userData) {
                    const newChat = await createNewChat(userData)
                    setSelectedChat(newChat)
                    navigate(`/seller/chat/${userData?._id}`, { replace: true })
                    setTimeout(() => {
                        markMessagesAsRead(userData?._id)
                    }, 1000)
                }
            } else if (!selectedChat && chatList.length > 0) {
                // Nếu không có user_id, chọn chat đầu tiên
                setSelectedChat(chatList[0])
                // Cập nhật URL với user_id của chat đầu tiên
                navigate(`/seller/chat/${chatList[0].user?._id}`, { replace: true })
                setTimeout(() => {
                    markMessagesAsRead(chatList[0].user?._id)
                }, 1000)
            } else if (selectedChat && selectedChat.unreadCount > 0) {
                markMessagesAsRead(selectedChat.user?._id)
            }
        })

        return () => unsubscribe()
    }, [user_id])

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

    useEffect(() => {
        if (imagePreview.length > 0) {
            imagePreview.forEach((image) => URL.revokeObjectURL(image))
        }
    }, [])

    const handleImageRemove = (index) => {
        URL.revokeObjectURL(imagePreview[index])
        setImagePreview((prev) => prev.filter((_, i) => i !== index))
        setSelectedImage((prev) => prev.filter((_, i) => i !== index))
    }

    const handleImageUpload = (e) => {
        if (e.target.files.length > 0 && e.target.files.length + selectedImage.length <= 7) {
            const files = Array.from(e.target.files)
            setSelectedImage([...selectedImage, ...files])
            setImagePreview([...imagePreview, ...files.map((file) => URL.createObjectURL(file))])
            e.target.value = ''
        }
    }

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
                    user: 'admin',
                }),
                updatedAt: serverTimestamp(),
            })
            if (selectedImage.length > 0) {
                try {
                    const uploadPromises = selectedImage.map(async (file) => {
                        const storageRef = ref(storage, `chat/${user._id}/${Date.now()}_${file.name}`)
                        await uploadBytes(storageRef, file)
                        const url = await getDownloadURL(storageRef)
                        return url
                    })
                    const imageUrls = await Promise.all(uploadPromises)
                    await updateDoc(chatRef, {
                        messages: arrayUnion({
                            message: {
                                type: 'customCard',
                                richElements: imageUrls.map((url) => ({
                                    type: 'image',
                                    rawUrl: url,
                                    accessibilityText: 'Hình ảnh được gửi',
                                })),
                            },
                            timestamp: new Date().toISOString(),
                            user: 'admin',
                        }),
                        updatedAt: serverTimestamp(),
                    })
                    imagePreview.forEach((image) => URL.revokeObjectURL(image))
                    setSelectedImage([])
                    setImagePreview([])
                } catch (error) {
                    console.error('Lỗi khi upload ảnh:', error)
                }
            }
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
                <div
                    key={`${message.message.id}-${index}`}
                    className={`message ${message.user === 'client' ? 'user' : 'admin'}`}
                >
                    <div className="message-content">{option.text}</div>
                    {index === message.message.options.length - 1 && (
                        <div className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>
                    )}
                </div>
            ))
        } else if (message.message.type === 'customCard') {
            return (
                <div key={index} className={`message ${message.user === 'client' ? 'user' : 'admin'}`}>
                    <div className="message-card-container">
                        {message.message.richElements.map((card, index) => {
                            if (card.type === 'info') {
                                return (
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
                                )
                            } else if (card.type === 'image') {
                                return (
                                    <div key={index} className="message-card">
                                        <img className="message-card-image__image" src={card.rawUrl} alt="card" />
                                    </div>
                                )
                            }
                            return null
                        })}
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
            return (
                message.message.richElements[message.message.richElements.length - 1].title ||
                message.message.richElements[message.message.richElements.length - 1].accessibilityText
            )
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
                        <div
                            key={chat.id}
                            className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedChat(chat)
                                navigate(`/seller/chat/${chat.user?._id}`, { replace: true })
                                if (chat.unreadCount > 0) {
                                    console.log('Đánh dấu tin nhắn đã đọc')
                                    markMessagesAsRead(chat.user?._id)
                                }
                            }}
                        >
                            <img src={chat.user?.avatar || defaultAvatar} alt="avatar" className="chat-avatar" />
                            <div className="chat-info">
                                <div className="chat-name">
                                    {chat.user?.name || chat.user?.email?.split('@')[0] || 'Khách hàng'}
                                </div>
                                <div className="chat-last-message">
                                    {convertLastMessage(chat.messages[chat.messages.length - 1]) || 'Chưa có tin nhắn'}
                                </div>
                            </div>
                            {chat.unreadCount > 0 && <div className="chat-unread-count">{chat.unreadCount}</div>}
                        </div>
                    ))}
            </div>

            {/* Khung chat */}
            <div className="chat-window">
                {selectedChat ? (
                    <>
                        <div className="chat-header">
                            <img
                                src={selectedChat?.user?.avatar || defaultAvatar}
                                alt="avatar"
                                className="chat-avatar"
                            />
                            <div className="chat-name">
                                {selectedChat?.user?.name || selectedChat?.user?.email?.split('@')[0] || 'Khách hàng'}
                            </div>
                        </div>

                        <div className="messages-container">
                            {selectedChat.messages.map((message, index) => convertMessage(message, index))}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="message-input d-flex flex-column gap-2">
                            {imagePreview.length > 0 && (
                                <div className="image-preview-container__chat">
                                    {imagePreview.map((image, index) => (
                                        <div key={index} className="image-preview-item__chat">
                                            <img src={image} alt="preview" className="image-preview" />
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                color="white"
                                                className="fs-2 py-3 px-3 image-preview-remove__chat"
                                                onClick={() => handleImageRemove(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="d-flex gap-3 align-items-center">
                                <div className="input-form d-flex align-items-center w-100 rounded-pill">
                                    <input
                                        type="text"
                                        className="input-text w-100 rounded-pill ps-4"
                                        placeholder="Nhập tin nhắn..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                </div>

                                <div className="d-flex gap-1">
                                    <FontAwesomeIcon
                                        icon={faPaperPlane}
                                        color="#0b6477"
                                        className="hover-icon fs-2 py-3 px-3 rounded-pill"
                                        onClick={handleSendMessage}
                                    />
                                    <FontAwesomeIcon
                                        icon={faImage}
                                        color="#0b6477"
                                        className="hover-icon fs-2 py-3 px-3 rounded-pill"
                                        onClick={() => fileInputRef.current.click()}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="d-none"
                                        multiple
                                        style={{ display: 'none' }}
                                        ref={fileInputRef}
                                        onChange={(e) => handleImageUpload(e)}
                                    />
                                </div>
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
