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

export const getPersonalizedRecommendations = async (user, allProducts, completedOrders, limit = 4) => {
    console.log(user, allProducts, completedOrders)
    try {
        if (!allProducts || !Array.isArray(allProducts) || allProducts.length === 0) {
            return []
        }

        // Nếu user chưa đăng nhập, trả về các sản phẩm phổ biến
        if (!user) {
            return allProducts.sort((a, b) => b.soldQuantity - a.soldQuantity).slice(0, limit)
        }

        // Nếu không có lịch sử đơn hàng, trả về sản phẩm theo rating cao
        if (!completedOrders || completedOrders.length === 0) {
            return allProducts.sort((a, b) => b.rating - a.rating).slice(0, limit)
        }

        // Lấy thông tin sản phẩm từ đơn hàng đã hoàn thành
        const purchaseHistory = completedOrders
            .filter((order) => order.status === 'delivered')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        // Tạo map để lưu trữ điểm số cho mỗi sản phẩm
        const productScores = new Map()

        // Duyệt qua từng đơn hàng
        purchaseHistory.forEach((order, orderIndex) => {
            order.products.forEach((item) => {
                const productId = item.product.product._id
                const product = allProducts.find((p) => p._id === productId)
                if (product) {
                    // Tính điểm dựa trên:
                    let score = 0

                    // 1. Thời gian mua (đơn hàng gần đây có trọng số cao hơn)
                    const recencyScore = 1 / (orderIndex + 1)

                    // 2. Số lượng mua
                    const quantityScore = item.quantity / 10 // Chuẩn hóa số lượng

                    // 3. Danh mục sản phẩm
                    const categories = product.categories.map((cat) => cat._id)

                    // Tổng hợp điểm
                    score = recencyScore * 0.4 + quantityScore * 0.3

                    // Lưu điểm và danh mục
                    if (productScores.has(productId)) {
                        const currentScore = productScores.get(productId)
                        productScores.set(productId, {
                            score: currentScore.score + score,
                            categories: categories,
                        })
                    } else {
                        productScores.set(productId, {
                            score: score,
                            categories: categories,
                        })
                    }
                }
            })
        })

        // Tìm các sản phẩm tương tự dựa trên danh mục đã mua
        const similarProducts = allProducts.map((product) => {
            if (productScores.has(product._id)) {
                return {
                    product,
                    score: productScores.get(product._id).score,
                }
            }

            // Tính điểm cho sản phẩm chưa mua dựa trên sự tương đồng danh mục
            let categoryMatchScore = 0
            productScores.forEach((value) => {
                const commonCategories = product.categories.filter((cat) => value.categories.includes(cat._id)).length
                categoryMatchScore += commonCategories / product.categories.length
            })

            return {
                product,
                score: categoryMatchScore * 0.3 + (product.rating / 5) * 0.2,
            }
        })

        // Sắp xếp và lấy top sản phẩm
        return similarProducts
            .sort((a, b) => b.score - a.score)
            .map((item) => item.product)
            .slice(0, limit)
    } catch (error) {
        console.error('Lỗi trong getPersonalizedRecommendations:', error)
        return []
    }
}
