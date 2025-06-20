import { useEffect, memo, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faImage, faMessage, faTimes } from '@fortawesome/free-solid-svg-icons'
import { serverTimestamp, doc, updateDoc, arrayUnion, getDoc, setDoc, onSnapshot, increment } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import swal from 'sweetalert2'
import { addItemToCart } from '../redux/slices/cartSlice'
import { getAnswerAction } from '../redux/slices/chatbotSlice'
import { db, storage } from '../firebase.config'
import './Chat.scss'

function Chatbot() {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [chatMode, setChatMode] = useState({
        show: false,
        mode: 'ai',
    })
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const fileInputRef = useRef(null)
    const [selectedImage, setSelectedImage] = useState([])
    const [imagePreview, setImagePreview] = useState([])
    const navigate = useNavigate()
    const location = useLocation()
    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (!user) return
        const chatHistoryRef = doc(db, 'chatAIHistory', user._id)
        const unsubscribe = onSnapshot(chatHistoryRef, (doc) => {
            if (doc.exists()) {
                setMessages(doc.data().messages || [])
                console.log('Lấy chat history:', doc.data().messages || [])
            } else {
                setMessages([])
            }
        })
        return () => unsubscribe()
    }, [user])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleImageUpload = (e) => {
        if (e.target.files.length > 0 && e.target.files.length + selectedImage.length <= 7) {
            const files = Array.from(e.target.files)
            setSelectedImage([...selectedImage, ...files])
            setImagePreview([...imagePreview, ...files.map((file) => URL.createObjectURL(file))])
            e.target.value = ''
        }
    }
    const handleImageRemove = (index) => {
        URL.revokeObjectURL(imagePreview[index])
        setImagePreview((prev) => prev.filter((_, i) => i !== index))
        setSelectedImage((prev) => prev.filter((_, i) => i !== index))
    }
    useEffect(() => {
        return () => {
            imagePreview.forEach((image) => URL.revokeObjectURL(image))
        }
    }, [])


    const handleSend = async () => {
        if (!input.trim() && selectedImage.length === 0) return;

        if (input.trim()) {
            // Gọi API chatbot để lấy câu trả lời
            try {
                // Lưu tin nhắn của user vào Firebase trước
                const message = input.trim();
                await saveChatMessage(
                    [{
                        type: 'text',
                        text: input.trim()
                    }],
                    true
                );
                // Clear input sau khi gửi
                setInput('');
                await dispatch(getAnswerAction(message));
            } catch (error) {
                console.error('Lỗi khi gọi API chatbot:', error);
            }
        }

        // Xử lý upload ảnh
        if (selectedImage.length > 0) {
            try {
                const uploadPromises = selectedImage.map(async (file) => {
                    const storageRef = ref(storage, `chat/${user._id}/${Date.now()}_${file.name}`);
                    await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(storageRef);
                    return url;
                });
                const imageUrls = await Promise.all(uploadPromises);

                // Lưu ảnh vào Firebase
                await saveChatMessage(
                    [{
                        type: 'customCard',
                        richElements: imageUrls.map((url) => ({
                            type: 'image',
                            rawUrl: url,
                            accessibilityText: 'Hình ảnh được gửi',
                        })),
                    }],
                    true
                );

                // Clear ảnh preview
                imagePreview.forEach((image) => URL.revokeObjectURL(image));
                setSelectedImage([]);
                setImagePreview([]);
            } catch (error) {
                console.error('Lỗi khi upload hình ảnh:', error);
            }
        }
    };

    // Thêm hàm xử lý chip click
    const handleChipClick = async (chipText) => {
        // Lưu tin nhắn từ chip vào Firebase
        await saveChatMessage(
            [{
                type: 'text',
                text: chipText
            }],
            true
        );

        // Gọi API chatbot với text từ chip
        try {
            await dispatch(getAnswerAction(chipText));
        } catch (error) {
            console.error('Lỗi khi gọi API chatbot từ chip:', error);
        }
    };

    const saveChatMessage = async (messages, isUserMessage) => {
        try {
            if (!user) return
            if (messages.length > 0) {
                const chatHistoryRef = doc(db, 'chatAIHistory', user._id)

                const chatHistory = await getDoc(chatHistoryRef)
                const messageObjects = messages.map((message) => ({
                    message,
                    user: isUserMessage ? 'client' : null,
                    timestamp: new Date().toISOString(),
                    read: chatMode.mode === 'ai' ? true : false,
                }))
                if (!chatHistory.exists()) {
                    await setDoc(chatHistoryRef, {
                        messages: messageObjects,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        user: {
                            _id: user._id,
                            name: user.name,
                            avatar: user.urlImage,
                            email: user.email,
                        },
                        unreadCount: chatMode.mode === 'human' && isUserMessage ? 1 : 0,
                    })
                } else {
                    if (chatMode.mode === 'human' && isUserMessage) {
                        await updateDoc(chatHistoryRef, {
                            messages: arrayUnion(...messageObjects),
                            updatedAt: serverTimestamp(),
                            unreadCount: increment(1),
                        })
                    } else {
                        await updateDoc(chatHistoryRef, {
                            messages: arrayUnion(...messageObjects),
                            updatedAt: serverTimestamp(),
                        })
                    }
                }
            }
        } catch (error) {
            console.error('Lỗi khi lưu tin nhắn:', error)
        }
    }

    const handleSwitchMode = () => {
        if (chatMode.mode === 'human') {
            if (imagePreview.length > 0) {
                imagePreview.forEach((image) => URL.revokeObjectURL(image))
                setImagePreview([])
                setSelectedImage([])
            }
        }
        setChatMode((prev) => {
            return { ...prev, mode: prev.mode === 'ai' ? 'human' : 'ai' }
        })
    }

    return (
        <>
            {!chatMode.show && user && (
                <button
                    className="primary-btn shadow-none rounded-5 position-fixed btn-switch-chat"
                    onClick={() => setChatMode((prev) => ({ ...prev, show: true }))}
                >
                    <FontAwesomeIcon icon={faMessage} size="2x" />
                </button>
            )}
            {chatMode.show && user && (
                <>
                    <div className="chatbot-popup">
                        <div className="chatbot-header">
                            <span>{chatMode.mode === 'ai' ? 'Trợ lý AI Heartie' : 'Nhân viên Heartie'}</span>
                            <button className="chatbot-close-btn"
                                onClick={() => setChatMode((prev) => ({ ...prev, show: false }))}
                            >&#10005;</button>
                        </div>
                        <div className="chatbot-body">
                            {messages.map((msg, idx) => {
                                if (msg.message.type === 'text') {
                                    // Xử lý tin nhắn text như cũ
                                    return (
                                        <div key={idx} className={`chatbot-bubble ${msg.user ? 'user' : 'bot'}`}>
                                            {msg.message.text}
                                        </div>
                                    );
                                } else if (msg.message.type === 'chips') {
                                    // Xử lý chips như cũ
                                    return (
                                        <div key={idx} className="chatbot-chips">
                                            {msg.message.options.map((option, i) => (
                                                <button
                                                    key={i}
                                                    className="chatbot-chip"
                                                    onClick={() => handleChipClick(option.text)}
                                                >
                                                    {option.text}
                                                </button>
                                            ))}
                                        </div>
                                    );
                                } else if (msg.message.type === 'customCard' && msg.message.richElements) {
                                    // Xử lý custom card cho sản phẩm
                                    return (
                                        <div key={idx} className="message-card-container">
                                            {msg.message.richElements.map((product, i) => (
                                                <div key={`${idx}-${i}`} className="message-card" onClick={() => navigate(product.actionLink)}>
                                                    <div className="d-flex gap-2">
                                                        <img
                                                            src={product.image.src.rawUrl}
                                                            alt={product.title}
                                                            className="message-card-image"
                                                        />
                                                        <div className="message-card-content">
                                                            <h5>{product.title}</h5>
                                                            <p className="mb-0">{product.subtitle.toLocaleString()}đ</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        {imagePreview.length > 0 && (
                            <div className="chatbot-image-preview-container">
                                {imagePreview.map((image, index) => (
                                    <div key={index} className="chatbot-image-preview-item">
                                        <img src={image} alt="Preview" />
                                        <FontAwesomeIcon
                                            className="chatbot-image-preview-remove"
                                            icon={faTimes}
                                            onClick={() => handleImageRemove(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="chatbot-footer">
                            <input
                                type="text"
                                placeholder="Nhập văn bản..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSend()}
                                className="chatbot-input"
                            />
                            {chatMode.mode === 'human' && (
                                <>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        multiple={true}
                                        onChange={handleImageUpload}
                                    />
                                    <FontAwesomeIcon icon={faImage} className="chatbot-img-btn" onClick={() => fileInputRef.current.click()} />
                                </>
                            )}
                            <button className="chatbot-send-btn" onClick={handleSend}>
                                <FontAwesomeIcon icon={faPaperPlane} size="lg" color="#14919b" />
                            </button>
                        </div>
                    </div>
                    <button
                        className="primary-btn shadow-none rounded-5 position-fixed btn-switch-chat"
                        onClick={handleSwitchMode}
                    >
                        <p>Chat với {chatMode.mode === 'ai' ? 'Nhân viên' : 'AI'}</p>
                    </button>
                </>
            )}
        </>
    )
}

export default memo(Chatbot)