import axios from 'axios'

const API_URL = 'http://localhost:5000/chatbot/'

export const getAnswer = async (question) => {
    try {
        const response = await axios.get(API_URL + 'get-answer/' + question, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error fetching answer from chatbot:', error)
        throw error
    }
}
