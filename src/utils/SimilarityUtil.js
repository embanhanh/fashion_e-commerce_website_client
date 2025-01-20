export const calculateCosineSimilarity = (vector1, vector2) => {
    const dotProduct = vector1.reduce((acc, val, i) => acc + val * vector2[i], 0)
    const magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val * val, 0))
    const magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val * val, 0))

    return dotProduct / (magnitude1 * magnitude2)
}
