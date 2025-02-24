import { useEffect, memo, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faImage, faMessage, faCirclePlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { serverTimestamp, doc, updateDoc, arrayUnion, getDoc, setDoc, onSnapshot, increment } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert2'
import { addItemToCart } from '../redux/slices/cartSlice'

import messageIcon from '../assets/image/default/messenger.png'
import { db, storage } from '../firebase.config'
import './Chat.scss'

function Chatbot() {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [chatMode, setChatMode] = useState({
        show: false,
        mode: 'ai',
    })
    const historyLoadedRef = useRef(false)
    const fileInputRef = useRef(null)
    const [selectedImage, setSelectedImage] = useState([])
    const [imagePreview, setImagePreview] = useState([])
    const navigate = useNavigate()
    const location = useLocation()

    // Thêm hàm xử lý upload hình ảnh
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

    useEffect(() => {
        if (!user) return

        const chatHistoryRef = doc(db, 'chatAIHistory', user._id)
        const unsubscribe = onSnapshot(chatHistoryRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data()
                const messages = data.messages || []
                const dfMessenger = document.querySelector('df-messenger')
                if (dfMessenger) {
                    if (!historyLoadedRef.current) {
                        console.log('Vào load lịch sử: ', messages)
                        dfMessenger.clearStorage()
                        messages.forEach((message) => {
                            message.message.type === 'text'
                                ? dfMessenger.renderCustomText(
                                      message.message.text,
                                      message.user === 'admin' || !message.user
                                  )
                                : message.message.type === 'chips'
                                ? dfMessenger.renderCustomCard([message.message])
                                : dfMessenger.renderCustomCard(message.message.richElements)
                        })
                        historyLoadedRef.current = true
                    } else {
                        const lastMessage = messages[messages.length - 1]
                        if (lastMessage && lastMessage.user === 'admin') {
                            // const dfMessengerChatBubble = document.querySelector('df-messenger-chat-bubble')
                            // if (dfMessengerChatBubble) {
                            //     dfMessengerChatBubble.openMinChat({
                            //         anchor: 'top-left',
                            //     })
                            // }
                            lastMessage.message.type === 'text'
                                ? dfMessenger.renderCustomText(lastMessage.message.text, true)
                                : lastMessage.message.type === 'chips'
                                ? dfMessenger.renderCustomCard([lastMessage.message])
                                : dfMessenger.renderCustomCard(lastMessage.message.richElements)
                        }
                    }
                }
            } else {
                const dfMessenger = document.querySelector('df-messenger')
                if (dfMessenger) {
                    dfMessenger.clearStorage()
                    historyLoadedRef.current = false
                }
            }
        })

        return () => unsubscribe()
    }, [user])

    useEffect(() => {
        const dfMessenger = document.querySelector('df-messenger')
        if (dfMessenger) {
            dfMessenger.clearStorage()
        }
        historyLoadedRef.current = false
    }, [user?._id])

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

    const handleDfMessengerResponse = async (event) => {
        if (event.type === 'df-user-input-entered') {
            // Lưu tin nhắn của người dùng
            await saveChatMessage(
                [
                    {
                        type: 'text',
                        text: event.detail.input,
                    },
                ],
                true
            )
            if (selectedImage.length > 0) {
                try {
                    const uploadPromises = selectedImage.map(async (file) => {
                        const storageRef = ref(storage, `chat/${user._id}/${Date.now()}_${file.name}`)
                        await uploadBytes(storageRef, file)
                        const url = await getDownloadURL(storageRef)
                        return url
                    })
                    const imageUrls = await Promise.all(uploadPromises)
                    const dfMessenger = document.querySelector('df-messenger')
                    if (dfMessenger) {
                        dfMessenger.renderCustomCard(
                            imageUrls.map((url) => ({
                                type: 'image',
                                rawUrl: url,
                                accessibilityText: 'Hình ảnh được gửi',
                            }))
                        )
                    }
                    await saveChatMessage(
                        [
                            {
                                type: 'customCard',
                                richElements: imageUrls.map((url) => ({
                                    type: 'image',
                                    rawUrl: url,
                                    accessibilityText: 'Hình ảnh được gửi',
                                })),
                            },
                        ],
                        true
                    )
                    imagePreview.forEach((image) => URL.revokeObjectURL(image))
                    setSelectedImage([])
                    setImagePreview([])
                } catch (error) {
                    console.error('Lỗi khi upload hình ảnh:', error)
                }
            }
        } else if (event.type === 'df-response-received') {
            // Lưu tin nhắn từ chatbot
            await saveChatMessage(event.detail.messages, false)
        }
    }

    const handleDfRequestSent = (event) => {
        console.log('handleDfRequestSent: ', chatMode.mode)
        if (chatMode.mode === 'human') {
            event.preventDefault()
        }
    }

    const handleChatOpenChanged = (event) => {
        setChatMode((prev) => ({
            ...prev,
            show: event.detail.isOpen,
        }))
    }

    const handleChipClick = (event) => {
        saveChatMessage(
            [
                {
                    type: 'text',
                    text: event.detail.text,
                },
            ],
            true
        )
    }

    const handleDfButtonClicked = async (event) => {
        // Ngăn chặn hành vi mặc định của button
        event.preventDefault()
        console.log('event: ', event)

        // Kiểm tra xem có phải event add-to-cart không
        if (event.detail?.event) {
            const variantInfo = event.detail.event
            try {
                if (!user) {
                    swal.fire({
                        title: 'Vui lòng đăng nhập',
                        text: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng',
                        icon: 'warning',
                        confirmButtonText: 'Đăng nhập',
                        showCancelButton: true,
                        cancelButtonText: 'Đóng',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/user/login', { state: { from: location.pathname } })
                        }
                    })
                    return
                }

                // Thêm vào giỏ hàng
                await dispatch(
                    addItemToCart({
                        variant: variantInfo.variantId,
                        quantity: 1,
                    })
                ).unwrap()

                // Hiển thị thông báo trong chat
                const dfMessenger = document.querySelector('df-messenger')
                if (dfMessenger) {
                    dfMessenger.renderCustomText(
                        `✅ Đã thêm sản phẩm vào giỏ hàng:\n${variantInfo.productName}\nSize: ${
                            variantInfo.size
                        } - Màu: ${variantInfo.color}\nGiá: ${variantInfo.price.toLocaleString()}đ`,
                        true
                    )
                }
                await saveChatMessage(
                    [
                        {
                            type: 'text',
                            text: `✅ Đã thêm sản phẩm vào giỏ hàng:\n${variantInfo.productName}\nSize: ${
                                variantInfo.size
                            } - Màu: ${variantInfo.color}\nGiá: ${variantInfo.price.toLocaleString()}đ`,
                        },
                    ],
                    false
                )

                // Hiển thị thông báo thành công
                swal.fire({
                    title: 'Thêm vào giỏ hàng thành công',
                    text: `${variantInfo.productName} - Size: ${variantInfo.size} - Màu: ${variantInfo.color}`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Xem giỏ hàng',
                    cancelButtonText: 'Tiếp tục mua sắm',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/cart')
                    }
                })
            } catch (error) {
                console.error('Lỗi khi thêm vào giỏ hàng:', error)
                swal.fire({
                    title: 'Có lỗi xảy ra',
                    text: 'Không thể thêm sản phẩm vào giỏ hàng',
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                })
            }
        }
    }

    useEffect(() => {
        window.addEventListener('df-user-input-entered', handleDfMessengerResponse)
        window.addEventListener('df-response-received', handleDfMessengerResponse)
        window.addEventListener('df-chat-open-changed', handleChatOpenChanged)
        window.addEventListener('df-request-sent', handleDfRequestSent)
        window.addEventListener('df-chip-clicked', handleChipClick)
        window.addEventListener('df-button-clicked', handleDfButtonClicked)

        return () => {
            window.removeEventListener('df-user-input-entered', handleDfMessengerResponse)
            window.removeEventListener('df-response-received', handleDfMessengerResponse)
            window.removeEventListener('df-chat-open-changed', handleChatOpenChanged)
            window.removeEventListener('df-request-sent', handleDfRequestSent)
            window.removeEventListener('df-chip-clicked', handleChipClick)
            window.removeEventListener('df-button-clicked', handleDfButtonClicked)
        }
    }, [chatMode.mode, selectedImage, user, navigate, dispatch, location.pathname])
    return (
        <>
            {chatMode.show && user && (
                <>
                    <button
                        className="primary-btn shadow-none rounded-5 position-fixed btn-switch-chat"
                        onClick={() => {
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
                            const dfMessenger = document.querySelector('df-messenger')
                            if (dfMessenger && dfMessenger.renderCustomText) {
                                dfMessenger.renderCustomText(
                                    `Chuyển sang chat với ${chatMode.mode === 'ai' ? 'Nhân viên' : 'AI'}`,
                                    true
                                )
                            }
                        }}
                    >
                        <p>Chat với {chatMode.mode === 'ai' ? 'Nhân viên' : 'AI'}</p>
                    </button>
                    {chatMode.mode === 'human' && (
                        <div className="position-fixed chatbot-additional-btn">
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                multiple={true}
                                onChange={(e) => handleImageUpload(e)}
                            />
                            <FontAwesomeIcon icon={faImage} onClick={() => fileInputRef.current.click()} />
                        </div>
                    )}
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
                </>
            )}
            <df-messenger
                location={import.meta.env.VITE_DIALOGFLOW_LOCATION}
                project-id={import.meta.env.VITE_DIALOGFLOW_PROJECT_ID}
                agent-id={import.meta.env.VITE_DIALOGFLOW_AGENT_ID}
                language-code="vi"
                max-query-length="-1"
            >
                <df-messenger-chat-bubble
                    chat-icon={messageIcon}
                    chat-title={chatMode.mode === 'ai' ? `Trợ lý AI Heartie` : `Nhân viên Heartie`}
                    placeholder-text="Nhập văn bản..."
                ></df-messenger-chat-bubble>
            </df-messenger>
        </>
    )
}

export default memo(Chatbot)
