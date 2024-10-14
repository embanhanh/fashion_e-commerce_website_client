import React, { useEffect, useState, useMemo, useCallback } from 'react'
import './ProductManagement.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faList } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan, faEye } from '@fortawesome/free-regular-svg-icons'
import { BsGridFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, setFilters, setSortOption, setCurrentPage, deleteProductAction } from '../../redux/slices/productSlice'
import { fetchCategories } from '../../redux/slices/categorySlice'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import CategoryDropdown from '../../components/CategoryDropdown'

function ProductManagement() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { products, totalPages, currentPage, filters, sortOption, status } = useSelector((state) => state.product)
    const { categories, status: categoryStatus, error: categoryError } = useSelector((state) => state.category)
    const [viewMode, setViewMode] = useState('list')
    const [stockQuantityRange, setStockQuantityRange] = useState({ min: 0, max: Infinity })
    const [soldQuantityRange, setSoldQuantityRange] = useState({ min: 0, max: Infinity })
    const [search, setSearch] = useState('')
    const [selectedCategories, setSelectedCategories] = useState([])

    const debouncedFetchProducts = useCallback(
        debounce(() => {
            dispatch(fetchProducts({ ...filters, sort: sortOption, page: currentPage }))
        }, 300),
        [dispatch, filters, sortOption, currentPage]
    )

    useEffect(() => {
        debouncedFetchProducts()
    }, [debouncedFetchProducts])

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    const handleSelectCategory = (category) => {
        setSelectedCategories([category])
    }

    const handleStockQuantityChange = (type, value) => {
        setStockQuantityRange((prev) => ({ ...prev, [type]: value }))
    }

    const handleSoldQuantityChange = (type, value) => {
        setSoldQuantityRange((prev) => ({ ...prev, [type]: value }))
    }

    const handleDeleteProduct = (product_name) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            dispatch(deleteProductAction(product_name))
        }
    }

    const handleSubmitFilters = () => {
        dispatch(
            setFilters({
                stockQuantity: stockQuantityRange,
                soldQuantity: soldQuantityRange,
                search,
                category: selectedCategories.map((category) => category._id),
            })
        )
    }

    const renderProductItem = (product, index) => {
        if (viewMode === 'list') {
            return (
                <div key={index} className="product-grid product-row">
                    <div className="checkbox-cell">
                        <label className="d-flex align-items-center">
                            <input type="checkbox" className="input-checkbox" />
                            <span className="custom-checkbox"></span>
                        </label>
                    </div>
                    <div className="product-info">
                        <img src={product.urlImage[0]} alt="" className="product-image" />
                        <p className="fs-4 fw-medium">{product.name}</p>
                    </div>
                    <p className="fs-4 fw-medium text-center">{product.categories.map((category) => categories.find((c) => c._id === category).name).join(', ')}</p>
                    <p className="fs-4 fw-medium text-center">{product.originalPrice - (product.originalPrice * product.discount) / 100}</p>
                    <p className="fs-4 fw-medium text-center">{product.stockQuantity}</p>
                    <p className="fs-4 fw-medium text-center">{product.soldQuantity}</p>
                    <div className="d-flex align-items-center flex-column px-4">
                        <FontAwesomeIcon icon={faPen} className="fs-3 p-2 hover-icon" color="#4a90e2" onClick={() => navigate(`/seller/products/edit/${product.slug}`)} />
                        <FontAwesomeIcon icon={faTrashCan} className="fs-3 my-2 p-2 hover-icon" color="#e74c3c" onClick={() => handleDeleteProduct(product.slug)} />
                        <FontAwesomeIcon icon={faEye} className="fs-3 my-2 p-2 hover-icon" color="#000" onClick={() => navigate(`/seller/products/detail/${product.slug}`)} />
                    </div>
                </div>
            )
        } else {
            return (
                <div key={index} className="product-grid-item">
                    <img src={product.urlImage[0]} alt="" className="product-image" />
                    <div className="product-details">
                        <p className="fs-4 fw-medium product-name">{product.name}</p>
                        <div className="product-info">
                            <p className="fs-4 fw-medium">{product.originalPrice - (product.originalPrice * product.discount) / 100}</p>
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <p className="fs-4 fw-medium">kho: {product.stockQuantity}</p>
                                <p className="fs-4 fw-medium">đã bán: {product.soldQuantity}</p>
                            </div>
                            <div className="d-flex justify-content-center">
                                <FontAwesomeIcon icon={faPen} className="fs-3 p-2 mx-2 hover-icon" color="#4a90e2" onClick={() => navigate(`/seller/products/edit/${product.slug}`)} />
                                <FontAwesomeIcon icon={faTrashCan} className="fs-3 p-2 mx-2 hover-icon" color="#e74c3c" onClick={() => handleDeleteProduct(product.slug)} />
                                <button className="primary-btn shadow-none px-2 py-0">
                                    <p className="m-0">Chi tiết</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <>
            <div className=" pb-5">
                <div className="bg-white border">
                    <p className="fs-3 fw-medium p-3 border-bottom">Quản lý sản phẩm</p>
                    <div className="row p-3 g-4">
                        <div className="col-6 d-flex align-items-center">
                            <p className="fs-4 fw-medium text-nowrap me-4 label-width text-end">Tên sản phẩm</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="text" className="input-text w-100" placeholder="Tên sản phẩm" value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <p className="fs-4 fw-medium text-nowrap me-4 label-width text-end">Danh mục</p>
                            <CategoryDropdown categories={categories} onSelect={handleSelectCategory} selectedCategories={selectedCategories} isMultiple={false} />
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <p className="fs-4 fw-medium text-nowrap me-4 label-width text-end">Kho hàng</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" onChange={(e) => handleStockQuantityChange('min', e.target.value)} className="input-text w-100" placeholder="Từ" />
                            </div>
                            <span className="mx-3 fs-2">-</span>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" onChange={(e) => handleStockQuantityChange('max', e.target.value)} className="input-text w-100" placeholder="Đến" />
                            </div>
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <p className="fs-4 fw-medium text-nowrap me-4 label-width text-end">Đã bán</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" onChange={(e) => handleSoldQuantityChange('min', e.target.value)} className="input-text w-100" placeholder="Từ" />
                            </div>
                            <span className="mx-3 fs-2">-</span>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" onChange={(e) => handleSoldQuantityChange('max', e.target.value)} className="input-text w-100" placeholder="Đến" />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex p-3 justify-content-center align-items-center">
                        <button
                            className="primary-btn shadow-none py-1 px-4 rounded-2 border-1"
                            onClick={() => {
                                handleSubmitFilters()
                            }}
                        >
                            <p className="fs-4 fw-medium">Tìm</p>
                        </button>

                        <button
                            className="ms-3 py-1 px-4 rounded-2 border bg-white"
                            onClick={() => {
                                setSearch('')
                                setStockQuantityRange({ min: 0, max: Infinity })
                                setSoldQuantityRange({ min: 0, max: Infinity })
                                setSelectedCategories([])
                            }}
                        >
                            <p className="fs-4 fw-medium">Nhập lại</p>
                        </button>
                    </div>
                </div>
                <div className="bg-white border mt-3">
                    <p className="fs-3 fw-medium p-3 border-bottom">Danh sách sản phẩm</p>
                    <div className="p-3 d-flex align-items-center justify-content-between">
                        <p className="fs-3 fw-medium">20 sản phẩm</p>
                        <div className="d-flex">
                            <button className="primary-btn shadow-none py-2 px-4 rounded-2 border-1" onClick={() => navigate('/seller/products/create')}>
                                <p className="fs-4 fw-medium">
                                    Thêm sản phẩm mới <span className="ms-2">+</span>
                                </p>
                            </button>
                            <div className="select ms-3">
                                <div className="selected" data-default="Mặc định" data-one="Giá bán tăng dần" data-two="Giá bán giảm dần" data-three="Tồn kho tăng dần" data-four="Tồn kho giảm dần">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="all">
                                        <input id="all" name="option" type="radio" defaultChecked value="" />
                                        <label className="option" htmlFor="all" data-txt="Mặc định" />
                                    </div>
                                    <div title="option-1">
                                        <input id="option-1" name="option" type="radio" value="priceAsc" onChange={(e) => dispatch(setSortOption(e.target.value))} />
                                        <label className="option" htmlFor="option-1" data-txt="Giá bán tăng dần" />
                                    </div>
                                    <div title="option-2">
                                        <input id="option-2" name="option" type="radio" value="priceDesc" onChange={(e) => dispatch(setSortOption(e.target.value))} />
                                        <label className="option" htmlFor="option-2" data-txt="Giá bán giảm dần" />
                                    </div>
                                    <div title="option-3">
                                        <input id="option-3" name="option" type="radio" value="stockAsc" onChange={(e) => dispatch(setSortOption(e.target.value))} />
                                        <label className="option" htmlFor="option-3" data-txt="Tồn kho tăng dần" />
                                    </div>
                                    <div title="option-4">
                                        <input id="option-4" name="option" type="radio" value="stockDesc" onChange={(e) => dispatch(setSortOption(e.target.value))} />
                                        <label className="option" htmlFor="option-4" data-txt="Tồn kho giảm dần" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-3">
                        <div className="border rounded-2 p-3">
                            <div className="product-header product-grid">
                                {viewMode === 'list' && (
                                    <>
                                        <div className="checkbox-cell">
                                            <label className="d-flex align-items-center">
                                                <input type="checkbox" className="input-checkbox" />
                                                <span className="custom-checkbox"></span>
                                            </label>
                                        </div>
                                        <p className="fs-4 fw-medium">Tên sản phẩm</p>
                                        <p className="fs-4 fw-medium text-center">Danh mục</p>
                                        <p className="fs-4 fw-medium text-center">Giá bán</p>
                                        <p className="fs-4 fw-medium text-center">Kho hàng</p>
                                        <p className="fs-4 fw-medium text-center">Đã bán</p>
                                    </>
                                )}
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faList} className={`fs-3 p-2 view-icon ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} />
                                    <BsGridFill className={`p-2 ms-2 view-icon ${viewMode === 'grid' ? 'active' : ''}`} size={27.5} onClick={() => setViewMode('grid')} />
                                </div>
                            </div>
                            <div className={`product-container ${viewMode}`}>{products.map((product, index) => renderProductItem(product, index))}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductManagement
