const API_URL = 'http://localhost:5000/user/'

export const login = async (user) => {
    try {
        const response = await fetch(API_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message)
        }

        return response.json()
    } catch (error) {
        throw error
    }
}

export const register = async (user) => {
    try {
        const response = await fetch(API_URL + 'register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message)
        }

        return response.json()
    } catch (error) {
        throw error
    }
}

export const loginWithFirebase = async (token, type) => {
    try {
        const response = await fetch(API_URL + `login/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(token),
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message)
        }

        return response.json()
    } catch (error) {
        throw error
    }
}
