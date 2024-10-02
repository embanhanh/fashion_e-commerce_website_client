import React, { useState } from 'react'
import './ProductManagement.scss'
import img from '../../assets/image/product_image/product_image_1.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faList } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { BsGridFill } from 'react-icons/bs'

function ProductManagement() {
    const [viewMode, setViewMode] = useState('list')

    const products = [
        { name: 'Giày thể thao nam Adidas', category: 'Phụ kiện', price: '1.000.000đ', stockQuantity: 100, soldQuantity: 100 },
        {
            name: 'Giày thể thao nam Adidas phong cách thể thao với độ bền cao của chất liệu cao su và phối màu đẹp mắt',
            category: 'Phụ kiện',
            price: '1.000.000đ',
            stockQuantity: 100,
            soldQuantity: 100,
        },
        {
            name: 'Giày thể thao nam Adidas phong cách thể thao với độ bền cao của chất liệu cao su và phối màu đẹp mắt',
            category: 'Phụ kiện',
            price: '1.000.000đ',
            stockQuantity: 100,
            soldQuantity: 100,
        },
        {
            name: 'Giày thể thao nam Adidas phong cách thể thao với độ bền cao của chất liệu cao su và phối màu đẹp mắt',
            category: 'Phụ kiện',
            price: '1.000.000đ',
            stockQuantity: 100,
            soldQuantity: 100,
        },
        {
            name: 'Giày thể thao nam Adidas phong cách thể thao với độ bền cao của chất liệu cao su và phối màu đẹp mắt',
            category: 'Phụ kiện',
            price: '1.000.000đ',
            stockQuantity: 100,
            soldQuantity: 100,
        },
        {
            name: 'Giày thể thao nam Adidas phong cách thể thao với độ bền cao của chất liệu cao su và phối màu đẹp mắt',
            category: 'Phụ kiện',
            price: '1.000.000đ',
            stockQuantity: 100,
            soldQuantity: 100,
        },
        {
            name: 'Giày thể thao nam Adidas phong cách thể thao với độ bền cao của chất liệu cao su và phối màu đẹp mắt',
            category: 'Phụ kiện',
            price: '1.000.000đ',
            stockQuantity: 100,
            soldQuantity: 100,
        },
        {
            name: 'Giày thể thao nam Adidas phong cách thể thao với độ bền cao của chất liệu cao su và phối màu đẹp mắt',
            category: 'Phụ kiện',
            price: '1.000.000đ',
            stockQuantity: 100,
            soldQuantity: 100,
        },
        {
            name: 'Giày thể thao nam Adidas phong cách thể thao với độ bền cao của chất liệu cao su và phối màu đẹp mắt',
            category: 'Phụ kiện',
            price: '1.000.000đ',
            stockQuantity: 100,
            soldQuantity: 100,
        },

        // Thêm các sản phẩm khác nếu cần
    ]

    const toggleViewMode = () => {
        setViewMode((prevMode) => (prevMode === 'list' ? 'grid' : 'list'))
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
                        <img src={img} alt="" className="product-image" />
                        <p className="fs-4 fw-medium">{product.name}</p>
                    </div>
                    <p className="fs-4 fw-medium text-center">{product.category}</p>
                    <p className="fs-4 fw-medium text-center">{product.price}</p>
                    <p className="fs-4 fw-medium text-center">{product.stockQuantity}</p>
                    <p className="fs-4 fw-medium text-center">{product.soldQuantity}</p>
                    <div className="d-flex align-items-center flex-column">
                        <FontAwesomeIcon icon={faPen} className="fs-3 p-2 hover-icon" color="#4a90e2" />
                        <FontAwesomeIcon icon={faTrashCan} className="fs-3 my-2 p-2 hover-icon" color="#e74c3c" />
                        <button className="primary-btn shadow-none px-2 py-0">
                            <p className="">Chi tiết</p>
                        </button>
                    </div>
                </div>
            )
        } else {
            return (
                <div key={index} className="product-grid-item">
                    <img src={img} alt="" className="product-image" />
                    <div className="product-details">
                        <p className="fs-4 fw-medium product-name">{product.name}</p>
                        <div className="product-info">
                            <p className="fs-4 fw-medium">{product.price}</p>
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <p className="fs-4 fw-medium">kho: {product.stockQuantity}</p>
                                <p className="fs-4 fw-medium">đã bán: {product.soldQuantity}</p>
                            </div>
                            <div className="d-flex justify-content-center">
                                <FontAwesomeIcon icon={faPen} className="fs-3 p-2 mx-2" color="#4a90e2" />
                                <FontAwesomeIcon icon={faTrashCan} className="fs-3 p-2 mx-2" color="#e74c3c" />
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
                                <input type="text" className="input-text w-100" placeholder="Tên sản phẩm" />
                            </div>
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <p className="fs-4 fw-medium text-nowrap me-4 label-width text-end">Danh mục</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="text" className="input-text w-100" placeholder="" />
                            </div>
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <p className="fs-4 fw-medium text-nowrap me-4 label-width text-end">Kho hàng</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" className="input-text w-100" placeholder="Từ" />
                            </div>
                            <span className="mx-3 fs-2">-</span>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" className="input-text w-100" placeholder="Đến" />
                            </div>
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <p className="fs-4 fw-medium text-nowrap me-4 label-width text-end">Đã bán</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" className="input-text w-100" placeholder="Từ" />
                            </div>
                            <span className="mx-3 fs-2">-</span>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" className="input-text w-100" placeholder="Đến" />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex p-3 justify-content-center align-items-center">
                        <button className="primary-btn shadow-none py-1 px-4 rounded-2 border-1">
                            <p className="fs-4 fw-medium">Tìm</p>
                        </button>

                        <button className="ms-3 py-1 px-4 rounded-2 border bg-white">
                            <p className="fs-4 fw-medium">Nhập lại</p>
                        </button>
                    </div>
                </div>
                <div className="bg-white border mt-3">
                    <p className="fs-3 fw-medium p-3 border-bottom">Danh sách sản phẩm</p>
                    <div className="p-3 d-flex align-items-center justify-content-between">
                        <p className="fs-3 fw-medium">20 sản phẩm</p>
                        <div className="d-flex">
                            <button className="primary-btn shadow-none py-2 px-4 rounded-2 border-1">
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
                                        <input id="option-1" name="option" type="radio" value="priceAsc" />
                                        <label className="option" htmlFor="option-1" data-txt="Giá bán tăng dần" />
                                    </div>
                                    <div title="option-2">
                                        <input id="option-2" name="option" type="radio" value="priceDesc" />
                                        <label className="option" htmlFor="option-2" data-txt="Giá bán giảm dần" />
                                    </div>
                                    <div title="option-3">
                                        <input id="option-3" name="option" type="radio" value="stockAsc" />
                                        <label className="option" htmlFor="option-3" data-txt="Tồn kho tăng dần" />
                                    </div>
                                    <div title="option-4">
                                        <input id="option-4" name="option" type="radio" value="stockDesc" />
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
                                    <FontAwesomeIcon icon={faList} className={`fs-3 p-2 hover-icon ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} />
                                    <BsGridFill className={`p-2 ms-2 hover-icon ${viewMode === 'grid' ? 'active' : ''}`} size={27.5} onClick={() => setViewMode('grid')} />
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
