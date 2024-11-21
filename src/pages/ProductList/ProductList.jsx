import './ProductList.scss'
import { useEffect, useState, useMemo, useCallback } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { debounce } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import Accordion from '../../components/Accordion'
import ProductCard from '../../components/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, setFilters, setSortOption, setCurrentPage } from '../../redux/slices/productSlice'
import { fetchCategories } from '../../redux/slices/categorySlice'
import { removeDiacritics, removeVietnameseTones } from '../../utils/StringUtil'
import Rating from '../../components/Rating'

function ProductList() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { products, totalPages, currentPage, filters, sortOption, status } = useSelector((state) => state.product)
    const { categories, status: categoryStatus, error: categoryError } = useSelector((state) => state.category)
    const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity })
    const [selectedSizes, setSelectedSizes] = useState([])
    const [selectedColors, setSelectedColors] = useState([])

    const debouncedFetchProducts = useCallback(
        debounce(() => {
            dispatch(fetchProducts({ ...filters, sort: sortOption, page: currentPage }))
        }, 300),
        [dispatch, filters, sortOption, currentPage]
    )

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    useEffect(() => {
        debouncedFetchProducts()
    }, [debouncedFetchProducts])

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
        setSelectedSizes((prev) => {
            if (prev.includes(size)) {
                return prev.filter((s) => s !== size)
            } else {
                return [...prev, size]
            }
        })
    }

    const handleColorChange = (color) => {
        setSelectedColors((prev) => {
            if (prev.includes(color)) {
                return prev.filter((c) => c !== color)
            } else {
                return [...prev, color]
            }
        })
    }

    useEffect(() => {
        dispatch(setFilters({ size: selectedSizes }))
    }, [selectedSizes, dispatch])

    useEffect(() => {
        dispatch(setFilters({ color: selectedColors }))
    }, [selectedColors, dispatch])

    const applyPriceFilter = () => {
        dispatch(setFilters({ priceRange }))
    }

    const handleFilterChange = (filterType, value) => {
        dispatch(setFilters({ [filterType]: value }))
    }

    const handleSortChange = (e) => {
        dispatch(setSortOption(e.target.value))
    }

    const handlePageChange = useCallback(
        (page) => {
            dispatch(setCurrentPage(page))
        },
        [dispatch]
    )

    const handleRatingChange = (value) => {
        dispatch(setFilters({ rating: value }))
    }

    return (
        <>
            <div className="container h-100 py-5">
                <p className="fs-3 fw-bold">Cửa hàng</p>
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
                        >
                            <Accordion
                                data={filteredCategories.map((parent) => ({
                                    title: parent.name,
                                    content: parent.children.map((child) => ({ name: child.name, id: child._id })),
                                    isChecked: true,
                                    id: parent._id,
                                }))}
                                onChange={(value) => handleFilterChange('category', value)}
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
                                    <div className="ms-3 input-form d-flex align-items-center " style={{ height: '30px' }}>
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
                                            <input type="checkbox" className="input-checkbox" checked={selectedColors.includes(color)} onChange={() => handleColorChange(color)} />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                        <div className={`rounded-3 filter-color shadow-sm ms-3 bg-${removeDiacritics(color.toLowerCase())}`}></div>
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
                                        <input type="checkbox" className="input-checkbox" checked={selectedSizes.includes(size)} onChange={() => handleSizeChange(size)} />
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
                                    <input type="text" className="input-text w-100" placeholder="Tìm kiếm" onChange={(e) => handleFilterChange('search', e.target.value)} value={filters.search} />
                                    <FontAwesomeIcon icon={faSearch} size="xl" className="theme-color p-2" />
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <p className="fw-medium me-4 fs-3">Sắp xếp theo</p>
                                <div className="select">
                                    <div className="selected" data-default="Mặc định" data-one="Giá cả tăng dần" data-two="Giá cả giảm dần" data-three="Phổ biến" data-four="Mới nhất">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                        </svg>
                                    </div>
                                    <div className="options">
                                        <div title="all">
                                            <input id="all" name="option" type="radio" defaultChecked value="" onChange={handleSortChange} />
                                            <label className="option" htmlFor="all" data-txt="Mặc định" />
                                        </div>
                                        <div title="option-1">
                                            <input id="option-1" name="option" type="radio" value="priceAsc" onChange={handleSortChange} />
                                            <label className="option" htmlFor="option-1" data-txt="Giá cả tăng dần" />
                                        </div>
                                        <div title="option-2">
                                            <input id="option-2" name="option" type="radio" value="priceDesc" onChange={handleSortChange} />
                                            <label className="option" htmlFor="option-2" data-txt="Giá cả giảm dần" />
                                        </div>
                                        <div title="option-3">
                                            <input id="option-3" name="option" type="radio" value="popular" onChange={handleSortChange} />
                                            <label className="option" htmlFor="option-3" data-txt="Phổ biến" />
                                        </div>
                                        <div title="option-4">
                                            <input id="option-4" name="option" type="radio" value="newest" onChange={handleSortChange} />
                                            <label className="option" htmlFor="option-4" data-txt="Mới nhất" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row" style={{ minHeight: '200px' }}>
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
                                        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 g-4" onClick={() => navigate(`/products/${product.slug}`)}>
                                            <ProductCard name={product.name} originalPrice={product.originalPrice} discount={product.discount} rating={product.rating} url={product.urlImage[0]} />
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
                        <div className="">
                            {/* <Pagination>
                                <Pagination.Prev
                                    onClick={() => {
                                        window.scrollTo(0, 0)
                                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                                    }}
                                    disabled={currentPage === 1}
                                >
                                    <FontAwesomeIcon icon={faCaretLeft} size="lg" />
                                </Pagination.Prev>
                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => {
                                        window.scrollTo(0, 0)
                                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                    }}
                                    disabled={currentPage === totalPages}
                                >
                                    <FontAwesomeIcon icon={faCaretRight} size="lg" />
                                </Pagination.Next>
                            </Pagination> */}
                            <Pagination>
                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductList
