import React, { useState } from 'react'
import './CreateVoucher.scss'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const CreateVoucher = () => {
    return (
        <div className="w-75 pb-5">
            <div className="bg-white border">
                <p className="fs-3 fw-medium p-3 border-bottom">Tạo khuyến mãi</p>
                <div className="p-4">
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Loại mã:
                        </p>
                        <div className="w-100 d-flex align-items-center">
                            <div className="select ">
                                <div className="selected" data-default="Loại mã" data-one="Giảm giá toàn Shop" data-two="Giảm giá theo sản phẩm">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="all">
                                        <input id="all-v2" name="option-v2" type="radio" defaultChecked value="" />
                                        <label className="option" htmlFor="all-v2" data-txt="Loại mã" />
                                    </div>
                                    <div title="option-1">
                                        <input id="option-1-v2" name="option-v2" type="radio" value="all" />
                                        <label className="option" htmlFor="option-1-v2" data-txt="Giảm giá toàn Shop" />
                                    </div>
                                    <div title="option-2">
                                        <input id="option-2-v2" name="option-v2" type="radio" value="product" />
                                        <label className="option" htmlFor="option-2-v2" data-txt="Giảm giá theo sản phẩm" />
                                    </div>
                                </div>
                            </div>
                            <button className="mx-3 shadow-none px-3 py-2 border bg-white ">
                                <p className="fs-4 fw-medium">Chọn sản phẩm</p>
                            </button>
                            <p className="fs-4 fw-medium">3 Sản phẩm đã chọn</p>
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Mã khuyến mãi:
                        </p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input type="text" className="input-text w-100" placeholder="Mã khuyến mãi" />
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Thời gian sử dụng mã:
                        </p>
                        <div className="w-100 d-flex">
                            <DatePicker selectsStart className="input-form fs-4 ps-3" placeholderText="Chọn ngày bắt đầu" />
                            <span className="mx-3 fs-2">-</span>
                            <DatePicker selectsEnd className="input-form fs-4 ps-3" placeholderText="Chọn ngày kết thúc" />
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Loại giảm giá|Mức giá:
                        </p>
                        <div className="w-100 d-flex  align-items-center">
                            <div className="select">
                                <div className="selected" data-default="Loại giảm giá" data-one="Theo phần trăm" data-two="Theo số tiền">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="all">
                                        <input id="all" name="option" type="radio" defaultChecked value="" />
                                        <label className="option" htmlFor="all" data-txt="Loại giảm giá" />
                                    </div>
                                    <div title="option-1">
                                        <input id="option-1" name="option" type="radio" value="all" />
                                        <label className="option" htmlFor="option-1" data-txt="Theo phần trăm" />
                                    </div>
                                    <div title="option-2">
                                        <input id="option-2" name="option" type="radio" value="product" />
                                        <label className="option" htmlFor="option-2" data-txt="Theo số tiền" />
                                    </div>
                                </div>
                            </div>

                            <div className="input-form d-flex align-items-center ms-3">
                                <input type="number" className="input-text w-100" placeholder="Mức giảm giá" />
                            </div>
                            <div className="input-form d-flex align-items-center ms-3">
                                <input type="number" className="input-text w-100" placeholder="Giảm tối đa" />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Giá trị đơn hàng tối thiểu:
                        </p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input type="number" className="input-text w-100" placeholder="Giá trị đơn hàng tối thiểu" />
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Tổng lượt sử dụng tối đa:
                        </p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input type="number" className="input-text w-100" placeholder="Tổng lượt sử dụng tối đa" />
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Lượt sử dụng tối đa/Người:
                        </p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input type="number" className="input-text w-100" placeholder="Lượt sử dụng tối đa/Người" />
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Thiết lập hiển thị:
                        </p>
                        <div className="w-100 d-flex  align-items-center">
                            <div className="select">
                                <div className="selected" data-default="Hiển thị" data-one="Công khai" data-two="Riêng tư">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="all">
                                        <input id="all-v3" name="option-v3" type="radio" defaultChecked value="" />
                                        <label className="option" htmlFor="all-v3" data-txt="Hiển thị" />
                                    </div>
                                    <div title="option-1">
                                        <input id="option-1-v3" name="option-v3" type="radio" value="all" />
                                        <label className="option" htmlFor="option-1-v3" data-txt="Công khai" />
                                    </div>
                                    <div title="option-2">
                                        <input id="option-2-v3" name="option-v3" type="radio" value="product" />
                                        <label className="option" htmlFor="option-2-v3" data-txt="Riêng tư" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="d-flex flex-row-reverse mt-4">
                <div className="">
                    <div className="d-flex flex-row-reverse">
                        <button className="primary-btn px-4 py-2 shadow-none ms-4 rounded-0">
                            <p>Xác nhận</p>
                            <div className="dot-spinner ms-4">
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                            </div>
                        </button>
                        <button className="border px-3 ms-4 bg-white" onClick={() => navigate(-1)}>
                            <p>Hủy</p>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CreateVoucher
