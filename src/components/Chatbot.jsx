import { useEffect, memo } from 'react'
import { db } from '../firebase.config'
import { serverTimestamp, doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'

function Chatbot() {
    const { user } = useSelector((state) => state.auth)

    const initChatHistory = async () => {
        if (!user) return

        try {
            const chatHistoryRef = doc(db, 'chatAIHistory', user._id)
            const chatDoc = await getDoc(chatHistoryRef)

            if (!chatDoc.exists()) {
                await setDoc(chatHistoryRef, {
                    messages: [],
                    createdAt: serverTimestamp(),
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
                user: isUserMessage
                    ? {
                          _id: user._id,
                          name: user.name,
                          avatar: user.urlImage,
                          email: user.email,
                      }
                    : null,
                timestamp: new Date().toISOString(),
            }))

            await updateDoc(chatHistoryRef, {
                messages: arrayUnion(...messageObjects),
            })
        } catch (error) {
            console.error('Lỗi khi lưu tin nhắn:', error)
        }
    }

    useEffect(() => {
        initChatHistory()
        const handleDfMessengerResponse = (event) => {
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

        window.addEventListener('df-user-input-entered', handleDfMessengerResponse)
        window.addEventListener('df-response-received', handleDfMessengerResponse)

        return () => {
            window.removeEventListener('df-user-input-entered', handleDfMessengerResponse)
            window.removeEventListener('df-response-received', handleDfMessengerResponse)
        }
    }, [])

    return (
        <>
            <df-messenger
                location={import.meta.env.VITE_DIALOGFLOW_LOCATION}
                project-id={import.meta.env.VITE_DIALOGFLOW_PROJECT_ID}
                agent-id={import.meta.env.VITE_DIALOGFLOW_AGENT_ID}
                language-code="vi"
                max-query-length="-1"
            >
                <df-messenger-chat-bubble chat-title="ai-for-clothes-store"></df-messenger-chat-bubble>
            </df-messenger>
        </>
    )
}

export default memo(Chatbot)
