import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import product from '../assets/image/product_image/cotton_shirt.png'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, setFilters, deleteProductAction, deleteManyProductsAction } from '../redux/slices/productSlice'

const ProductModal = ({ show, onHide, handleConfirm, voucherData }) => {
    const dispatch = useDispatch()
    const { products, totalPages, currentPage, filters, sortOption, status } = useSelector((state) => state.product)
    const [selectedProducts, setSelectedProducts] = useState([])
    useEffect(() => {
        dispatch(fetchProducts({ ...filters, sort: sortOption, page: currentPage, limit: 1000000 }))
    }, [dispatch, currentPage, sortOption, filters])

    useEffect(() => {
        if (voucherData) {
            setSelectedProducts(voucherData.applicableProducts)
        }
    }, [voucherData])

    const handleSearch = (e) => {
        dispatch(setFilters({ ...filters, search: e.target.value }))
    }

    const handleSelectProduct = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter((id) => id !== productId))
        } else {
            setSelectedProducts([...selectedProducts, productId])
        }
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fs-3 fw-medium">Chọn sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="input-form d-flex align-items-center w-100">
                    <input type="text" value={filters.search || ''} onChange={handleSearch} className="input-text w-100" placeholder="Tên sản phẩm" />
                </div>
                <div className="product-list p-3">
                    {status === 'loading' ? (
                        <section className="dots-container mt-4">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </section>
                    ) : products.length === 0 ? (
                        <p className="fs-3 fw-medium text-center">Không có sản phẩm nào</p>
                    ) : (
                        products.map((product) => (
                            <div key={product._id} className="d-flex align-items-center justify-content-between border-bottom py-3">
                                <div className="d-flex align-items-center">
                                    <img src={product.urlImage[0]} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                    <div className="ms-3">
                                        <p className="fs-4 fw-medium">{product.name}</p>
                                        <p className="fs-5">{product.originalPrice - (product.originalPrice * product.discount) / 100}</p>
                                    </div>
                                </div>
                                <div className="product-action">
                                    <label className="d-flex align-items-center mx-3">
                                        <input type="checkbox" className="input-checkbox" checked={selectedProducts.includes(product._id)} onChange={() => handleSelectProduct(product._id)} />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="p-2 px-3 bg-white border " onClick={onHide}>
                    <p className="fs-4 fw-medium">Hủy</p>
                </button>
                <button className="primary-btn shadow-none rounded-0 px-4 py-2" onClick={() => handleConfirm(selectedProducts)}>
                    <p className="fs-4 fw-medium">Chọn</p>
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default ProductModal
