import { db } from '../firebase.config'
import { getDoc, collection, query, orderBy, onSnapshot, doc, updateDoc, setDoc, arrayUnion, serverTimestamp, where, getDocs } from 'firebase/firestore'

// Constants
const CHAT_COLLECTION = 'chatAIHistory'

export const createNewChat = async (userData) => {
    const newChat = {
        user: {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
        },
        messages: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    }

    await setDoc(doc(db, CHAT_COLLECTION, userData._id), newChat)
    return {
        ...newChat,
    }
}

export const markMessagesAsRead = async (userId) => {
    const chatRef = doc(db, CHAT_COLLECTION, userId)
    const chatDoc = await getDoc(chatRef)

    if (chatDoc.exists()) {
        const chat = chatDoc.data()
        const updatedMessages = chat.messages.map((msg) => ({
            ...msg,
            read: true,
        }))

        await updateDoc(chatRef, {
            messages: updatedMessages,
            unreadCount: 0,
        })
    }
}
