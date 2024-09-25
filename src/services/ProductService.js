const API_URL = 'http://localhost:5000/product/'

export const createProduct = async (productData) => {
    try {
        const response = await fetch(API_URL + 'create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
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
