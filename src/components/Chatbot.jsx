import { useEffect, memo, useState } from 'react'
import { db } from '../firebase.config'
import { serverTimestamp, doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import './Chat.scss'

function Chatbot() {
    const { user } = useSelector((state) => state.auth)
    const [chatMode, setChatMode] = useState({
        show: false,
        mode: 'ai',
    })

    const initChatHistory = async () => {
        if (!user) return

        try {
            const chatHistoryRef = doc(db, 'chatAIHistory', user._id)
            const chatDoc = await getDoc(chatHistoryRef)

            if (!chatDoc.exists()) {
                await setDoc(chatHistoryRef, {
                    messages: [],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    user: {
                        _id: user._id,
                        name: user.name,
                        avatar: user.urlImage,
                        email: user.email,
                    },
                })
            }
        } catch (error) {
            console.error('Lỗi khởi tạo chat history:', error)
        }
    }

    const saveChatMessage = async (messages, isUserMessage) => {
        try {
            if (!user) return

            const chatHistoryRef = doc(db, 'chatAIHistory', user._id)

            const chatHistory = await getDoc(chatHistoryRef)

            const messageObjects = messages.map((message) => ({
                message,
                user: isUserMessage ? 'client' : null,
                timestamp: new Date().toISOString(),
            }))

            await updateDoc(chatHistoryRef, {
                messages: arrayUnion(...messageObjects),
                updatedAt: serverTimestamp(),
            })
        } catch (error) {
            console.error('Lỗi khi lưu tin nhắn:', error)
        }
    }

    useEffect(() => {
        initChatHistory()
        console.log(chatMode.mode)
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

        window.addEventListener('df-chat-open-changed', handleChatOpenChanged)
        window.addEventListener('df-user-input-entered', handleDfMessengerResponse)
        window.addEventListener('df-response-received', handleDfMessengerResponse)
        window.addEventListener('df-request-sent', handleDfRequestSent)

        return () => {
            window.removeEventListener('df-user-input-entered', handleDfMessengerResponse)
            window.removeEventListener('df-response-received', handleDfMessengerResponse)
            window.removeEventListener('df-chat-open-changed', handleChatOpenChanged)
            window.removeEventListener('df-request-sent', handleDfRequestSent)
        }
    }, [chatMode.mode])
    return (
        <>
            {chatMode.show && (
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
