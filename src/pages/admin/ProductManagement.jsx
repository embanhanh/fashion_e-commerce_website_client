import './ProductManagement.scss'
import img from '../../assets/image/product_image/product_image_1.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faList } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'

function ProductManagement() {
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
                            <div className="product-grid product-header">
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
                                <div className="d-flex align-items-center flex-column">
                                    <FontAwesomeIcon icon={faList} className="fs-3 p-2" />
                                </div>
                            </div>
                            <div className="product-grid product-row">
                                <div className="checkbox-cell">
                                    <label className="d-flex align-items-center">
                                        <input type="checkbox" className="input-checkbox" />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                </div>
                                <div className="product-info">
                                    <img src={img} alt="" className="product-image" />
                                    <p className="fs-4 fw-medium ">Giày thể thao nam Adidas</p>
                                </div>
                                <p className="fs-4 fw-medium text-center">Phụ kiện</p>
                                <p className="fs-4 fw-medium text-center">1.000.000đ</p>
                                <p className="fs-4 fw-medium text-center">100</p>
                                <p className="fs-4 fw-medium text-center">100</p>
                                <div className="d-flex align-items-center flex-column">
                                    <FontAwesomeIcon icon={faPen} className="fs-3 p-2" color="#4a90e2" />
                                    <FontAwesomeIcon icon={faTrashCan} className="fs-3 mt-2 p-2" color="#e74c3c" />
                                </div>
                            </div>
                            <div className="product-grid product-row">
                                <div className="checkbox-cell">
                                    <label className="d-flex align-items-center">
                                        <input type="checkbox" className="input-checkbox" />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                </div>
                                <div className="product-info">
                                    <img src={img} alt="" className="product-image" />
                                    <p className="fs-4 fw-medium">Giày thể thao nam Adidas phong cách thể thao với độ bền cao của chất liệu cao su và phối màu đẹp mắt asdasda a sd á dá da sds a </p>
                                </div>
                                <p className="fs-4 fw-medium text-center">Phụ kiện</p>
                                <p className="fs-4 fw-medium text-center">1.000.000đ</p>
                                <p className="fs-4 fw-medium text-center">100</p>
                                <p className="fs-4 fw-medium text-center">100</p>
                                <div className="d-flex align-items-center flex-column">
                                    <FontAwesomeIcon icon={faPen} className="fs-3 p-2" color="#4a90e2" />
                                    <FontAwesomeIcon icon={faTrashCan} className="fs-3 mt-2 p-2" color="#e74c3c" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductManagement
