import './ProductList.scss'
import { useEffect, useState, useMemo, useCallback, useLayoutEffect } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import { faSearch, faMicrophone, faImage } from '@fortawesome/free-solid-svg-icons'
import { debounce } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Accordion from '../../components/Accordion'
import ProductCard from '../../components/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, setFilters, setSortOption } from '../../redux/slices/productSlice'
import { fetchCategories } from '../../redux/slices/categorySlice'
import { removeDiacritics } from '../../utils/StringUtil'
import Rating from '../../components/Rating'
import VoiceModal from '../../components/VoiceModal/VoiceModal'
import { searchByImage } from '../../services/ProductService'
import Swal from 'sweetalert2'

function ProductList() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
    const { products, totalPages, sortOption, status } = useSelector((state) => state.product)
    const { categories, status: categoryStatus, error: categoryError } = useSelector((state) => state.category)
    const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity })
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState({
        category: [],
        priceRange: { min: 0, max: Infinity },
        color: [],
        size: [],
        stockQuantity: { min: 0, max: Infinity },
        soldQuantity: { min: 0, max: Infinity },
        search: '',
        rating: 0,
        brand: [],
        searchImageLabels: [],
    })
    const pageFromUrl = parseInt(searchParams.get('page')) || 1
    const [isListening, setIsListening] = useState(false)
    const [showVoiceModal, setShowVoiceModal] = useState(false)
    const [isSearchingImage, setIsSearchingImage] = useState(false)

    const debouncedFetchProducts = useCallback(
        debounce(async () => {
            await dispatch(fetchProducts({ ...filters, sort: sortOption, page: pageFromUrl, limit: 12 }))
        }, 300),
        [dispatch, filters, sortOption, pageFromUrl]
    )

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    useEffect(() => {
        const fetchProducts = async () => {
            await debouncedFetchProducts()
        }
        fetchProducts()
    }, [debouncedFetchProducts])

    useLayoutEffect(() => {
        const categoriesFromUrl = searchParams.get('category')
        if (categoriesFromUrl) {
            const categoriesFromUrlIds = categories.filter(
                (category) =>
                    categoriesFromUrl.split(',').includes(category.slug) ||
                    categoriesFromUrl.split(',').includes(category.parentCategory?.slug)
            )
            setFilters((prev) => ({ ...prev, category: categoriesFromUrlIds.map((category) => category._id) }))
        }
    }, [])

    useEffect(() => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev)
            if (filters.category.length > 0) {
                newParams.set(
                    'category',
                    filters.category.map((category) => categories.find((c) => c._id === category).slug).join(',')
                )
            } else {
                newParams.delete('category')
            }
            if (filters.priceRange.min !== 0 || filters.priceRange.max !== Infinity) {
                newParams.set('priceRange', `${filters.priceRange.min}-${filters.priceRange.max}`)
            } else {
                newParams.delete('priceRange')
            }
            if (filters.rating !== 0) {
                newParams.set('rating', filters.rating)
            } else {
                newParams.delete('rating')
            }
            if (filters.size.length > 0) {
                newParams.set('size', filters.size.join(','))
            } else {
                newParams.delete('size')
            }
            if (filters.color.length > 0) {
                newParams.set('color', filters.color.join(','))
            } else {
                newParams.delete('color')
            }
            if (filters.stockQuantity.min !== 0 || filters.stockQuantity.max !== Infinity) {
                newParams.set('stockQuantity', `${filters.stockQuantity.min}-${filters.stockQuantity.max}`)
            } else {
                newParams.delete('stockQuantity')
            }
            if (filters.soldQuantity.min !== 0 || filters.soldQuantity.max !== Infinity) {
                newParams.set('soldQuantity', `${filters.soldQuantity.min}-${filters.soldQuantity.max}`)
            } else {
                newParams.delete('soldQuantity')
            }
            if (filters.search) {
                newParams.set('search', filters.search)
            } else {
                newParams.delete('search')
            }
            if (!newParams.has('page') || totalPages <= 1) {
                newParams.set('page', '1')
            }
            return newParams
        })
    }, [filters, categories, setSearchParams, totalPages])

    const filteredCategories = useMemo(() => {
        return categories
            .filter((category) => !category.parentCategory)
            .map((parent) => ({
                ...parent,
                children: categories.filter((child) => child.parentCategory && child.parentCategory._id === parent._id),
            }))
    }, [categories])

    const handlePriceChange = (type, value) => {
        setPriceRange((prev) => ({ ...prev, [type]: value }))
    }

    const handleSizeChange = (size) => {
        setFilters((prev) =>
            prev.size.includes(size)
                ? { ...prev, size: prev.size.filter((s) => s !== size) }
                : { ...prev, size: [...prev.size, size] }
        )
    }

    const handleColorChange = (color) => {
        setFilters((prev) =>
            prev.color.includes(color)
                ? { ...prev, color: prev.color.filter((c) => c !== color) }
                : { ...prev, color: [...prev.color, color] }
        )
    }

    const applyPriceFilter = () => {
        setFilters((prev) => ({ ...prev, priceRange }))
    }

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({ ...prev, [filterType]: value }))
    }

    const handleSortChange = (e) => {
        dispatch(setSortOption(e.target.value))
    }

    const handlePageChange = useCallback(
        (page) => {
            window.scrollTo(0, 0)
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev)
                newParams.set('page', page)
                return newParams
            })
        },
        [setSearchParams]
    )

    const handleRatingChange = (value) => {
        setFilters((prev) => ({ ...prev, rating: value }))
    }

    const handleVoiceResult = (result) => {
        setSearch(result)
        handleFilterChange('search', result)
    }

    const handleVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window) {
            setShowVoiceModal(true)
        } else {
            alert('Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói')
        }
    }

    const handleImageSearch = async (e) => {
        const file = e.target.files[0]
        e.target.value = ''
        if (!file) return

        try {
            setIsSearchingImage(true)
            const { labels } = await searchByImage(file)

            // Đảm bảo labels là mảng
            const validLabels = Array.isArray(labels) ? labels : []

            // Cập nhật URL
            const searchParams = new URLSearchParams(window.location.search)
            searchParams.set('page', '1')
            navigate(`?${searchParams.toString()}`)

            // Tạo object filters mới
            const newFilters = {
                ...filters,
                search: '',
                searchImageLabels: validLabels,
            }

            // Dispatch action
            setFilters(newFilters)
            setSearch('')
        } catch (error) {
            console.error('Lỗi khi tìm kiếm bằng hình ảnh:', error)
            Swal.fire({
                title: 'Lỗi',
                text: 'Có lỗi xảy ra khi tìm kiếm bằng hình ảnh',
                icon: 'error',
            })
        } finally {
            setIsSearchingImage(false)
        }
    }

    useEffect(() => {
        console.log(filters)
    }, [filters])

    return (
        <>
            <div className="container h-100 py-5">
                <p className="fs-2 fw-bold theme-color">Cửa hàng</p>
                <div className="d-flex">
                    <div className="p-2" style={{ width: '20%' }}>
                        <Accordion
                            data={[
                                {
                                    title: 'Danh mục sản phẩm',
                                },
                            ]}
                            isOpen={true}
                            onChange={(value) => handleFilterChange('category', value)}
                            selectedItemIds={filters.category}
                        >
                            <Accordion
                                data={filteredCategories.map((parent) => ({
                                    title: parent.name,
                                    content: parent.children.map((child) => ({ name: child.name, id: child._id })),
                                    isChecked: true,
                                    id: parent._id,
                                }))}
                                onChange={(value) => handleFilterChange('category', value)}
                                selectedItemIds={filters.category}
                            />
                        </Accordion>
                        <div className=" w-100 border-bottom mt-2"></div>
                        <Accordion
                            data={[
                                {
                                    title: 'Lọc theo giá cả',
                                },
                            ]}
                            isOpen={true}
                        >
                            <div className="">
                                <div className="d-flex mb-3 align-items-center">
                                    <div className="input-form d-flex align-items-center " style={{ height: '30px' }}>
                                        <input
                                            type="number"
                                            autoComplete="off"
                                            className="input-text w-100"
                                            placeholder="Từ"
                                            min="0"
                                            max="9999999999"
                                            value={priceRange.min === 0 ? '' : priceRange.min}
                                            onChange={(e) => handlePriceChange('min', e.target.value)}
                                        />
                                    </div>
                                    <div
                                        className="ms-3 input-form d-flex align-items-center "
                                        style={{ height: '30px' }}
                                    >
                                        <input
                                            type="number"
                                            autoComplete="off"
                                            className="input-text w-100"
                                            placeholder="Đến"
                                            min="0"
                                            max="9999999999"
                                            value={priceRange.max === Infinity ? '' : priceRange.max}
                                            onChange={(e) => handlePriceChange('max', e.target.value || Infinity)}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="primary-btn btn-sm w-100 py-1 mb-2 shadow-none"
                                    onClick={() => {
                                        console.log(priceRange)
                                        applyPriceFilter()
                                    }}
                                >
                                    <p>Áp dụng</p>
                                </button>
                            </div>
                        </Accordion>
                        <div className=" w-100 border-bottom mt-2"></div>
                        <Accordion
                            data={[
                                {
                                    title: 'Lọc theo đánh giá',
                                },
                            ]}
                            isOpen={true}
                        >
                            <div className="d-flex align-items-center flex-column">
                                <div className="mb-2 py-2 d-flex">
                                    <Rating initialRating={0} size={16} gap={4} onRate={handleRatingChange} />
                                    <p className="ms-2 align-self-end">Trở lên</p>
                                </div>
                            </div>
                        </Accordion>
                        <div className=" w-100 border-bottom mt-2"></div>
                        <Accordion
                            data={[
                                {
                                    title: 'Lọc theo màu sắc',
                                },
                            ]}
                            isOpen={true}
                        >
                            {['Đen', 'Trắng', 'Đỏ', 'Xanh', 'Vàng', 'Cam', 'Nâu', 'Xám'].map((color) => (
                                <div key={color} className="d-flex py-2 align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="input-checkbox"
                                                checked={filters.color.includes(color)}
                                                onChange={() => handleColorChange(color)}
                                            />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                        <div
                                            className={`rounded-3 filter-color shadow-sm ms-3 bg-${removeDiacritics(
                                                color.toLowerCase()
                                            )}`}
                                        ></div>
                                        <p className="ms-3 fw-medium fs-4">{color}</p>
                                    </div>
                                    <p className="fw-medium fs-4"></p>
                                </div>
                            ))}
                        </Accordion>
                        <div className=" w-100 border-bottom mt-2"></div>
                        <Accordion
                            data={[
                                {
                                    title: 'Lọc theo kích cỡ',
                                },
                            ]}
                            isOpen={true}
                        >
                            {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                                <div key={size} className="d-flex align-items-center">
                                    <label className="d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            className="input-checkbox"
                                            checked={filters.size.includes(size)}
                                            onChange={() => handleSizeChange(size)}
                                        />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                    <p className="ms-3 fw-medium fs-4">{size}</p>
                                </div>
                            ))}
                        </Accordion>
                    </div>
                    <div style={{ width: '80%' }} className="px-5 py-2">
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-3 gap-3">
                            <div className="flex-grow-1">
                                <div className="input-form d-flex align-items-center gap-2 px-3 rounded-4">
                                    <input
                                        type="text"
                                        className="input-text w-100"
                                        placeholder="Tìm kiếm"
                                        onChange={(e) => setSearch(e.target.value)}
                                        value={search}
                                    />
                                    <label className="mb-0" style={{ cursor: 'pointer' }}>
                                        <FontAwesomeIcon
                                            icon={faImage}
                                            size="xl"
                                            className={`theme-color p-2 ${isSearchingImage ? 'fa-spin' : ''}`}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="d-none"
                                            onChange={handleImageSearch}
                                        />
                                    </label>
                                    <FontAwesomeIcon
                                        icon={faMicrophone}
                                        size="xl"
                                        className={`theme-color p-2 cursor-pointer ${isListening ? 'text-danger' : ''}`}
                                        onClick={handleVoiceSearch}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        size="xl"
                                        className="theme-color p-2"
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, search: search, searchImageLabels: [] }))
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <p className="fw-medium me-4 fs-3">Sắp xếp theo</p>
                                <div className="select">
                                    <div
                                        className="selected"
                                        data-default="Mặc định"
                                        data-one="Giá cả tăng dần"
                                        data-two="Giá cả giảm dần"
                                        data-three="Phổ biến"
                                        data-four="Mới nhất"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="1em"
                                            viewBox="0 0 512 512"
                                            className="arrow"
                                        >
                                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                        </svg>
                                    </div>
                                    <div className="options">
                                        <div title="all">
                                            <input
                                                id="all"
                                                name="option"
                                                type="radio"
                                                defaultChecked
                                                value=""
                                                onChange={handleSortChange}
                                            />
                                            <label className="option" htmlFor="all" data-txt="Mặc định" />
                                        </div>
                                        <div title="option-1">
                                            <input
                                                id="option-1"
                                                name="option"
                                                type="radio"
                                                value="priceAsc"
                                                onChange={handleSortChange}
                                            />
                                            <label className="option" htmlFor="option-1" data-txt="Giá cả tăng dần" />
                                        </div>
                                        <div title="option-2">
                                            <input
                                                id="option-2"
                                                name="option"
                                                type="radio"
                                                value="priceDesc"
                                                onChange={handleSortChange}
                                            />
                                            <label className="option" htmlFor="option-2" data-txt="Giá cả giảm dần" />
                                        </div>
                                        <div title="option-3">
                                            <input
                                                id="option-3"
                                                name="option"
                                                type="radio"
                                                value="popular"
                                                onChange={handleSortChange}
                                            />
                                            <label className="option" htmlFor="option-3" data-txt="Phổ biến" />
                                        </div>
                                        <div title="option-4">
                                            <input
                                                id="option-4"
                                                name="option"
                                                type="radio"
                                                value="newest"
                                                onChange={handleSortChange}
                                            />
                                            <label className="option" htmlFor="option-4" data-txt="Mới nhất" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="" style={{ minHeight: '1200px' }}>
                            <div className="row">
                                {status === 'loading' ? (
                                    <section className="dots-container mt-4">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </section>
                                ) : (
                                    <>
                                        {products.map((product, index) => (
                                            <div
                                                key={index}
                                                className="col-12 col-sm-6 col-md-4 col-lg-3 g-4"
                                                onClick={() => navigate(`/products/${product.slug}`)}
                                            >
                                                <ProductCard
                                                    name={product.name}
                                                    originalPrice={product.originalPrice}
                                                    discount={product.discount}
                                                    rating={product.rating}
                                                    url={product.urlImage[0]}
                                                    productId={product._id}
                                                />
                                            </div>
                                        ))}
                                        {products.length === 0 && (
                                            <div className="d-flex justify-content-center align-items-center">
                                                <p className="fw-medium fs-3">Không tìm thấy sản phẩm nào</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="">
                            <Pagination>
                                <Pagination.Prev
                                    onClick={() => {
                                        window.scrollTo(0, 0)
                                        handlePageChange(pageFromUrl - 1)
                                    }}
                                    disabled={pageFromUrl === 1}
                                >
                                    <FontAwesomeIcon icon={faCaretLeft} size="lg" />
                                </Pagination.Prev>
                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === pageFromUrl}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => {
                                        window.scrollTo(0, 0)
                                        handlePageChange(pageFromUrl + 1)
                                    }}
                                    disabled={pageFromUrl === totalPages}
                                >
                                    <FontAwesomeIcon icon={faCaretRight} size="lg" />
                                </Pagination.Next>
                            </Pagination>
                        </div>
                    </div>
                </div>
            </div>
            <VoiceModal show={showVoiceModal} onHide={() => setShowVoiceModal(false)} onResult={handleVoiceResult} />
        </>
    )
}

export default ProductList
