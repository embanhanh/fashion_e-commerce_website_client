import { db } from '../firebase.config'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, arrayUnion, serverTimestamp, where, getDocs } from 'firebase/firestore'

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

    const docRef = await addDoc(collection(db, CHAT_COLLECTION), newChat)
    return {
        id: docRef.id,
        ...newChat,
    }
}
