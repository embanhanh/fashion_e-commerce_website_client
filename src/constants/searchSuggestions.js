export const SEARCH_SUGGESTIONS = {
    // Quần áo nam
    áo: [
        'áo thun nam',
        'áo sơ mi nam',
        'áo khoác nam',
        'áo polo nam',
        'áo hoodie nam',
        'áo len nam',
        'áo vest nam',
    ],
    quần: [
        'quần jean nam',
        'quần tây nam',
        'quần short nam',
        'quần kaki nam',
        'quần jogger nam',
        'quần thể thao nam',
    ],

    // Quần áo nữ
    váy: [
        'váy dài',
        'váy ngắn',
        'váy xòe',
        'váy công sở',
        'váy dự tiệc',
        'chân váy',
        'đầm maxi',
    ],
    đầm: [
        'đầm suông',
        'đầm xòe',
        'đầm body',
        'đầm công sở',
        'đầm dự tiệc',
    ],

    // Phụ kiện
    giày: [
        'giày thể thao nam',
        'giày thể thao nữ',
        'giày cao gót',
        'giày sandal',
        'giày boots',
        'giày lười nam',
        'giày oxford nam',
    ],
    túi: [
        'túi xách nữ',
        'túi đeo chéo',
        'túi tote',
        'túi clutch',
        'balo nam',
        'balo nữ',
    ],
    phụ_kiện: [
        'thắt lưng nam',
        'thắt lưng nữ',
        'ví nam',
        'ví nữ',
        'mũ nón',
        'kính mát',
        'trang sức',
    ],

    // Theo chất liệu
    vải: [
        'cotton',
        'len',
        'lụa',
        'jeans',
        'kaki',
        'nỉ',
        'thun',
    ],

    // Theo mùa
    mùa: [
        'đồ thu đông',
        'đồ xuân hè',
        'áo khoác mùa đông',
        'đồ mùa hè',
    ],

    // Theo dịp
    dịp: [
        'đồ công sở',
        'đồ dự tiệc',
        'đồ thể thao',
        'đồ đi biển',
        'đồ ngủ',
    ],
}

// Hàm tìm gợi ý dựa trên từ khóa
export const getSuggestions = (keyword) => {
    keyword = keyword.toLowerCase().trim()
    if (!keyword) return []

    // Tìm các từ khóa chính khớp với input
    const matchingKeys = Object.keys(SEARCH_SUGGESTIONS).filter(
        (key) => keyword.includes(key) || key.includes(keyword)
    )

    // Gộp tất cả gợi ý từ các từ khóa khớp
    const suggestions = matchingKeys.reduce((acc, key) => {
        return [...acc, ...SEARCH_SUGGESTIONS[key]]
    }, [])

    // Tìm thêm các gợi ý có chứa từ khóa trong tất cả danh mục
    const allSuggestions = Object.values(SEARCH_SUGGESTIONS).flat()
    const additionalSuggestions = allSuggestions.filter(
        (suggestion) => suggestion.toLowerCase().includes(keyword)
    )

    // Kết hợp và loại bỏ trùng lặp
    return [...new Set([...suggestions, ...additionalSuggestions])]
        .filter((suggestion) => suggestion.toLowerCase().includes(keyword))
        .slice(0, 10) // Giới hạn số lượng gợi ý
}

// Thêm các từ khóa phổ biến
export const POPULAR_SEARCHES = [
    'áo thun nam',
    'váy đầm dự tiệc',
    'quần jean nam',
    'áo sơ mi công sở',
    'giày thể thao',
    'túi xách nữ',
] 