import { calculateCosineSimilarity } from '../utils/SimilarityUtil'

export const getRelatedProducts = async (currentProduct, allProducts, limit = 6) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!currentProduct || !allProducts || !Array.isArray(allProducts) || allProducts.length === 0) {
            console.warn('Dữ liệu đầu vào không hợp lệ cho getRelatedProducts')
            return []
        }

        // Kiểm tra các trường bắt buộc của currentProduct
        if (!currentProduct._id || !currentProduct.categories || !currentProduct.variants) {
            console.warn('currentProduct thiếu thông tin cần thiết')
            return []
        }

        // Lọc ra các sản phẩm hợp lệ
        const validProducts = allProducts.filter(
            (product) => product._id && product._id !== currentProduct._id && product.categories && product.variants
        )

        if (validProducts.length === 0) {
            console.warn('Không có sản phẩm hợp lệ để gợi ý')
            return []
        }

        // 1. Content-based Filtering
        const contentBasedScores = validProducts.map((product) => {
            let score = 0

            // So khớp danh mục
            if (product.categories && currentProduct.categories) {
                const commonCategories = product.categories.filter((cat) =>
                    currentProduct.categories.some((c) => c._id === cat._id)
                ).length
                score += (commonCategories / (currentProduct.categories?.length || 1)) * 0.3
            }

            // So khớp mức giá (trong khoảng ±30%)
            const priceRange = 0.3
            const minPrice = currentProduct.originalPrice * (1 - priceRange)
            const maxPrice = currentProduct.originalPrice * (1 + priceRange)
            if (product.originalPrice >= minPrice && product.originalPrice <= maxPrice) {
                score += 0.2
            }

            // So khớp thương hiệu
            if (product.brand === currentProduct.brand) {
                score += 0.2
            }

            // So khớp chất liệu
            if (product.material === currentProduct.material) {
                score += 0.15
            }

            // So khớp biến thể (màu sắc, kích thước)
            const commonVariants = product.variants.filter((variant) =>
                currentProduct.variants.some((v) => v.color === variant.color || v.size === variant.size)
            ).length
            score += (commonVariants / Math.max(product.variants.length, currentProduct.variants.length)) * 0.15

            return { product, score }
        })

        // 2. Collaborative Filtering (dựa trên hành vi mua sắm)
        const collaborativeScores = validProducts.map((product) => {
            let score = 0

            // So khớp rating
            const ratingDiff = Math.abs(product.rating - currentProduct.rating)
            score += (1 - ratingDiff / 5) * 0.4

            // So khớp lượt mua
            const maxSold = Math.max(...validProducts.map((p) => p.soldQuantity))
            const soldDiff = Math.abs(product.soldQuantity - currentProduct.soldQuantity)
            score += (1 - soldDiff / maxSold) * 0.6

            return { product, score }
        })

        // 3. Kết hợp điểm số
        const finalScores = validProducts.map((product) => {
            const contentScore = contentBasedScores.find((p) => p.product._id === product._id).score
            const collaborativeScore = collaborativeScores.find((p) => p.product._id === product._id).score

            // Trọng số: 60% content-based, 40% collaborative
            const finalScore = contentScore * 0.6 + collaborativeScore * 0.4

            return { product, score: finalScore }
        })

        // 4. Sắp xếp và lấy top sản phẩm
        return finalScores
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((item) => item.product)
    } catch (error) {
        console.error('Lỗi trong getRelatedProducts:', error)
        return []
    }
}
