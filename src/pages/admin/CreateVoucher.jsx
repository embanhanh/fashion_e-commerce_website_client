import React, { useState } from 'react'
import './CreateVoucher.scss'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ProductModal from '../../components/ProductModal'
import { useDispatch } from 'react-redux'
import { createVoucherAction } from '../../redux/slices/voucherSlice'
import Notification from '../../components/Notification'
import Modal from 'react-bootstrap/Modal'

const CreateVoucher = () => {
    const dispatch = useDispatch()
    const [voucherData, setVoucherData] = useState({
        voucherType: 'all',
        code: '',
        display: 'public',
        validFrom: new Date(),
        validUntil: new Date(),
        discountType: 'percentage',
        discountValue: '',
        maxDiscountValue: '',
        usageLimit: '',
        quantityPerUser: 1,
        minOrderValue: '',
        applicableProducts: [],
    })
    const [showProductModal, setShowProductModal] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    const [notificationType, setNotificationType] = useState('success')
    const [notificationTitle, setNotificationTitle] = useState('')

    const handleChange = (name, value) => {
        delete errors[name]
        setErrors({ ...errors })
        setVoucherData({ ...voucherData, [name]: value })
    }

    const validateField = (name, value) => {
        let error = ''
        switch (name) {
            case 'code':
                if (!value) error = 'Mã khuyến mãi không được để trống'
                break
            case 'validFrom':
            case 'validUntil':
                if (!value) error = 'Vui lòng chọn ngày'
                break
            case 'discountValue':
                if (!value) error = 'Mức giảm giá không được để trống'
                else if (voucherData.discountType === 'percentage' && (value < 0 || value > 100)) error = 'Phần trăm giảm giá phải từ 0 đến 100'
                break
            case 'maxDiscountValue':
                if (voucherData.discountType === 'percentage' && !value) error = 'Giảm tối đa không được để trống khi giảm theo phần trăm'
                break
            case 'minOrderValue':
                if (!value) error = 'Giá trị đơn hàng tối thiểu không được để trống'
                break
            case 'usageLimit':
                if (!value) error = 'Tổng lượt sử dụng tối đa không được để trống'
                break
            case 'quantityPerUser':
                if (!value) error = 'Lượt sử dụng tối đa/Người không được để trống'
                break
            default:
                break
        }
        return error
    }

    const validateForm = () => {
        const newErrors = {}
        Object.keys(voucherData).forEach((key) => {
            const error = validateField(key, voucherData[key])
            if (error) newErrors[key] = error
        })
        if (voucherData.voucherType === 'product' && voucherData.applicableProducts.length === 0) {
            newErrors.applicableProducts = 'Vui lòng chọn ít nhất một sản phẩm'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true)
            try {
                await dispatch(createVoucherAction(voucherData)).unwrap()
                setShowNotification(true)
                setNotificationTitle('Thành công')
                setNotificationMessage('Khuyến mãi đã được tạo thành công')
                setNotificationType('success')
            } catch (error) {
                setShowNotification(true)
                setNotificationTitle('Lỗi')
                setNotificationMessage('Có lỗi xảy ra khi tạo khuyến mãi ' + error.message)
                setNotificationType('error')
            } finally {
                setLoading(false)
            }
        }
    }

    const handleConfirm = (selectedProducts) => {
        setVoucherData({ ...voucherData, applicableProducts: selectedProducts })
        setShowProductModal(false)
    }

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
                                <div className="selected" data-one="Giảm giá toàn Shop" data-two="Giảm giá theo sản phẩm">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="option-1">
                                        <input
                                            id="option-1-v2"
                                            name="option-v2"
                                            type="radio"
                                            value="all"
                                            onChange={(e) => handleChange('voucherType', e.target.value)}
                                            checked={voucherData.voucherType === 'all'}
                                        />
                                        <label className="option" htmlFor="option-1-v2" data-txt="Giảm giá toàn Shop" />
                                    </div>
                                    <div title="option-2">
                                        <input
                                            id="option-2-v2"
                                            name="option-v2"
                                            type="radio"
                                            value="product"
                                            onChange={(e) => handleChange('voucherType', e.target.value)}
                                            checked={voucherData.voucherType === 'product'}
                                        />
                                        <label className="option" htmlFor="option-2-v2" data-txt="Giảm giá theo sản phẩm" />
                                    </div>
                                </div>
                            </div>
                            {voucherData.voucherType === 'product' && (
                                <>
                                    <button className="mx-3 shadow-none px-3 py-2 border bg-white" onClick={() => setShowProductModal(true)}>
                                        <p className="fs-4 fw-medium">Chọn sản phẩm</p>
                                    </button>
                                    <p className="fs-4 fw-medium"> {voucherData.applicableProducts.length} Sản phẩm đã chọn</p>
                                </>
                            )}
                        </div>
                    </div>
                    {errors.applicableProducts && <p className="text-danger mt-3">{errors.applicableProducts}</p>}
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Mã khuyến mãi:
                        </p>
                        <div className={`input-form d-flex align-items-center w-100 ${errors.code ? 'border-danger-subtle' : ''}`}>
                            <input value={voucherData.code || ''} type="text" className="input-text w-100" placeholder="Mã khuyến mãi" onChange={(e) => handleChange('code', e.target.value)} />
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Thời gian sử dụng mã:
                        </p>
                        <div className="w-100 d-flex">
                            <DatePicker
                                selectsStart
                                className="input-form fs-4 ps-3"
                                placeholderText="Chọn ngày bắt đầu"
                                selected={voucherData.validFrom}
                                startDate={voucherData.validFrom}
                                endDate={voucherData.validUntil}
                                onChange={(date) => handleChange('validFrom', date)}
                            />
                            <span className="mx-3 fs-2">-</span>
                            <DatePicker
                                selectsEnd
                                className="input-form fs-4 ps-3"
                                placeholderText="Chọn ngày kết thúc"
                                selected={voucherData.validUntil}
                                startDate={voucherData.validFrom}
                                endDate={voucherData.validUntil}
                                onChange={(date) => handleChange('validUntil', date)}
                            />
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Loại giảm giá|Mức giá:
                        </p>
                        <div className="w-100 d-flex  align-items-center">
                            <div className="select">
                                <div className="selected" data-one="Theo phần trăm" data-two="Theo số tiền">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="option-1">
                                        <input
                                            id="option-1"
                                            name="option"
                                            type="radio"
                                            value="percentage"
                                            onChange={(e) => handleChange('discountType', e.target.value)}
                                            checked={voucherData.discountType === 'percentage'}
                                        />
                                        <label className="option" htmlFor="option-1" data-txt="Theo phần trăm" />
                                    </div>
                                    <div title="option-2">
                                        <input
                                            id="option-2"
                                            name="option"
                                            type="radio"
                                            value="fixedamount"
                                            onChange={(e) => handleChange('discountType', e.target.value)}
                                            checked={voucherData.discountType === 'fixedamount'}
                                        />
                                        <label className="option" htmlFor="option-2" data-txt="Theo số tiền" />
                                    </div>
                                </div>
                            </div>

                            <div className={`input-form d-flex align-items-center ms-3 ${errors.discountValue ? 'border-danger-subtle' : ''}`}>
                                <input
                                    value={voucherData.discountValue || ''}
                                    type="number"
                                    className="input-text w-100"
                                    placeholder="Mức giảm giá"
                                    onChange={(e) => handleChange('discountValue', e.target.value)}
                                />
                            </div>
                            {voucherData.discountType === 'percentage' && (
                                <div className={`input-form d-flex align-items-center ms-3 ${errors.maxDiscountValue ? 'border-danger-subtle' : ''}`}>
                                    <input
                                        value={voucherData.maxDiscountValue || ''}
                                        type="number"
                                        className="input-text w-100"
                                        placeholder="Giảm tối đa"
                                        onChange={(e) => handleChange('maxDiscountValue', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Giá trị đơn hàng tối thiểu:
                        </p>
                        <div className={`input-form d-flex align-items-center w-100 ${errors.minOrderValue ? 'border-danger-subtle' : ''}`}>
                            <input
                                value={voucherData.minOrderValue || ''}
                                type="number"
                                className="input-text w-100"
                                placeholder="Giá trị đơn hàng tối thiểu"
                                onChange={(e) => handleChange('minOrderValue', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Tổng lượt sử dụng tối đa:
                        </p>
                        <div className={`input-form d-flex align-items-center w-100 ${errors.usageLimit ? 'border-danger-subtle' : ''}`}>
                            <input
                                value={voucherData.usageLimit || ''}
                                type="number"
                                className="input-text w-100"
                                placeholder="Tổng lượt sử dụng tối đa"
                                onChange={(e) => handleChange('usageLimit', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Lượt sử dụng tối đa/Người:
                        </p>
                        <div className={`input-form d-flex align-items-center w-100 ${errors.quantityPerUser ? 'border-danger-subtle' : ''}`}>
                            <input
                                value={voucherData.quantityPerUser || ''}
                                type="number"
                                className="input-text w-100"
                                placeholder="Lượt sử dụng tối đa/Người"
                                onChange={(e) => handleChange('quantityPerUser', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Thiết lập hiển thị:
                        </p>
                        <div className="w-100 d-flex  align-items-center">
                            <div className="select">
                                <div className="selected" data-one="Công khai" data-two="Riêng tư">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="option-1">
                                        <input
                                            id="option-1-v3"
                                            name="option-v3"
                                            type="radio"
                                            value="public"
                                            onChange={(e) => handleChange('display', e.target.value)}
                                            checked={voucherData.display === 'public'}
                                        />
                                        <label className="option" htmlFor="option-1-v3" data-txt="Công khai" />
                                    </div>
                                    <div title="option-2">
                                        <input
                                            id="option-2-v3"
                                            name="option-v3"
                                            type="radio"
                                            value="private"
                                            onChange={(e) => handleChange('display', e.target.value)}
                                            checked={voucherData.display === 'private'}
                                        />
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
                        <button className="primary-btn px-4 py-2 shadow-none ms-4 rounded-0" onClick={handleSubmit}>
                            <p>Xác nhận</p>
                            {loading && (
                                <div className="dot-spinner ms-4">
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                </div>
                            )}
                        </button>
                        <button className="border px-3 ms-4 bg-white" onClick={() => navigate(-1)}>
                            <p>Hủy</p>
                        </button>
                    </div>
                    {Object.keys(errors).length > 0 && <p className="text-danger mt-3">Vui lòng kiểm tra lại thông tin</p>}
                </div>
            </section>
            {showProductModal && <ProductModal show={showProductModal} onHide={() => setShowProductModal(false)} handleConfirm={handleConfirm} />}
            {showNotification && (
                <Modal
                    show={showNotification}
                    onHide={() => {
                        if (notificationType === 'success') {
                            setVoucherData({
                                voucherType: 'all',
                                code: '',
                                display: 'public',
                                validFrom: new Date(),
                                validUntil: new Date(),
                                discountType: 'percentage',
                                discountValue: '',
                                maxDiscountValue: '',
                                usageLimit: '',
                                quantityPerUser: 1,
                                minOrderValue: '',
                                applicableProducts: [],
                            })
                        }
                        setShowNotification(false)
                    }}
                    centered
                >
                    <Notification title={notificationTitle} description={notificationMessage} type={notificationType} />
                </Modal>
            )}
        </div>
    )
}

export default CreateVoucher
