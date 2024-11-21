import { useEffect, memo, useState, useRef } from 'react'
import { db } from '../firebase.config'
import { serverTimestamp, doc, updateDoc, arrayUnion, getDoc, setDoc, onSnapshot, increment } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import './Chat.scss'

function Chatbot() {
    const { user } = useSelector((state) => state.auth)
    const [chatMode, setChatMode] = useState({
        show: false,
        mode: 'ai',
    })
    const historyLoadedRef = useRef(false)

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
                                ? dfMessenger.renderCustomText(message.message.text, message.user === 'admin' || !message.user)
                                : dfMessenger.renderCustomCard([message.message])
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
                            lastMessage.message.type === 'text' ? dfMessenger.renderCustomText(lastMessage.message.text, true) : dfMessenger.renderCustomCard([lastMessage.message])
                        }
                    }
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
                    unreadCount: 0,
                })
            } else {
                await updateDoc(chatHistoryRef, {
                    messages: arrayUnion(...messageObjects),
                    updatedAt: serverTimestamp(),
                    unreadCount: chatMode.mode === 'ai' ? chatHistory.data().unreadCount : increment(1),
                })
            }
        } catch (error) {
            console.error('Lỗi khi lưu tin nhắn:', error)
        }
    }

    const handleDfMessengerResponse = (event) => {
        console.log('save chat message')
        if (event.type === 'df-user-input-entered') {
            // Lưu tin nhắn của người dùng
            saveChatMessage(
                [
                    {
                        type: 'text',
                        text: event.detail.input,
                    },
                ],
                true
            )
        } else if (event.type === 'df-response-received') {
            // Lưu tin nhắn từ chatbot
            saveChatMessage(event.detail.messages, false)
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

    useEffect(() => {
        window.addEventListener('df-chat-open-changed', handleChatOpenChanged)
        window.addEventListener('df-user-input-entered', handleDfMessengerResponse)
        window.addEventListener('df-response-received', handleDfMessengerResponse)
        window.addEventListener('df-request-sent', handleDfRequestSent)
        window.addEventListener('df-chip-clicked', handleChipClick)
        return () => {
            window.removeEventListener('df-user-input-entered', handleDfMessengerResponse)
            window.removeEventListener('df-response-received', handleDfMessengerResponse)
            window.removeEventListener('df-chat-open-changed', handleChatOpenChanged)
            window.removeEventListener('df-request-sent', handleDfRequestSent)
            window.removeEventListener('df-chip-clicked', handleChipClick)
        }
    }, [chatMode.mode])
    return (
        <>
            {chatMode.show && user && (
                <button
                    className="primary-btn shadow-none rounded-5 position-fixed btn-switch-chat"
                    onClick={() =>
                        setChatMode((prev) => {
                            const dfMessenger = document.querySelector('df-messenger')
                            if (dfMessenger) {
                                dfMessenger.renderCustomText(`Chuyển sang chat với ${chatMode.mode === 'ai' ? 'Nhân viên' : 'AI'}`, true)
                            }
                            return { ...prev, mode: chatMode.mode === 'ai' ? 'human' : 'ai' }
                        })
                    }
                >
                    <p>Chat với {chatMode.mode === 'ai' ? 'Nhân viên' : 'AI'}</p>
                </button>
            )}
            <df-messenger
                location={import.meta.env.VITE_DIALOGFLOW_LOCATION}
                project-id={import.meta.env.VITE_DIALOGFLOW_PROJECT_ID}
                agent-id={import.meta.env.VITE_DIALOGFLOW_AGENT_ID}
                language-code="vi"
                max-query-length="-1"
            >
                <df-messenger-chat-bubble chat-title={chatMode.mode === 'ai' ? `Trợ lý AI Heartie` : `Nhân viên Heartie`}></df-messenger-chat-bubble>
            </df-messenger>
        </>
    )
}

export default memo(Chatbot)
