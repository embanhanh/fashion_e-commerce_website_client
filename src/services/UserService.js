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
    const response = await fetch(API_URL + 'register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })

    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    return response.json()
}
