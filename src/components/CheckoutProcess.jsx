import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faStore, faCheck, faBagShopping, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import { getPromotionalComboByProductIdAction } from '../redux/slices/promotionalComboSlice'
import { getShopInfo } from '../redux/slices/shopSlice'
import { getVoucherByCodeAction } from '../redux/slices/voucherSlice'
import { createOrderFromGuestAction } from '../redux/slices/orderSilce'
import TomTomMap from './TomTomMap'
import Notification from './Notification'
import { calculateRouteDistance } from '../utils/MapUtils'
import productImg from '../assets/image/product_image/product_image_1.png'
import './CheckoutProcess.scss'

const STEPS = [
    { icon: faLocationDot, label: 'Địa chỉ giao hàng' },
    { icon: faStore, label: 'Phương thức đặt hàng' },
    { icon: faBagShopping, label: 'Xác nhận đơn hàng' },
]

const CheckoutProcess = ({ onClose, product, variantInfo }) => {
    const dispatch = useDispatch()
    const { shopInfo } = useSelector((state) => state.shop)
    const [currentStep, setCurrentStep] = useState(0)
    const [address, setAddress] = useState({
        email: '',
        name: '',
        phone: '',
        location: '',
        address: { lat: 21.0285, lng: 105.8542 },
    })
    const [orderData, setOrderData] = useState({
        shippingMethod: 'basic',
        paymentMethod: 'paymentUponReceipt',
        products: [{ product: variantInfo.variant._id, quantity: variantInfo.quantity }],
        productsPrice: variantInfo.variant.price * variantInfo.quantity,
        shippingPrice: product.shippingInfo.find((info) => info.type === 'basic').price,
        totalPrice: 0,
        vouchers: [],
        expectedDeliveryDate: {
            startDate: null,
            endDate: null,
        },
        transferOption: null,
    })
    const [comboDiscounts, setComboDiscounts] = useState(null)
    const [voucherInfo, setVoucherInfo] = useState({
        code: '',
        discountValue: 0,
    })
    const [errors, setErrors] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [notification, setNotification] = useState({
        title: '',
        description: '',
        type: '',
        show: false,
    })

    useEffect(() => {
        const fetchCombos = async () => {
            const result = await dispatch(getPromotionalComboByProductIdAction(product._id))
            const comboDiscounts = result.payload
            setComboDiscounts(comboDiscounts)
        }
        if (product) {
            fetchCombos()
        }
    }, [])

    const handleAddressChange = (key, value) => {
        setAddress((prev) => ({ ...prev, [key]: value }))
    }

    const handlePrice = () => {
        let price = orderData.products[0]?.quantity * variantInfo.variant.price || 0
        if (comboDiscounts) {
            if (orderData.products[0]?.quantity <= comboDiscounts?.limitCombo) {
                let discountValue = 0
                for (let i = 0; i < comboDiscounts.discountCombos.length; i++) {
                    if (orderData.products[0]?.quantity >= comboDiscounts.discountCombos[i].quantity) {
                        discountValue = comboDiscounts.discountCombos[i].discountValue
                    }
                }
                if (comboDiscounts.comboType === 'percentage') {
                    price *= 1 - discountValue / 100
                } else {
                    price -= discountValue
                }
            }
        }
        return price
    }

    const handleVoucher = async () => {
        let discountValue = 0
        if (voucherInfo.code) {
            try {
                const voucher = await dispatch(getVoucherByCodeAction(voucherInfo.code)).unwrap()
                if (voucher) {
                    if (voucher.voucherType === 'all') {
                        if (voucher.discountType === 'percentage') {
                            discountValue = (orderData.productsPrice * voucher.discountValue) / 100
                        } else {
                            discountValue = voucher.discountValue
                        }
                    } else if (voucher.voucherType === 'product') {
                        if (voucher.applicableProducts.includes(product._id)) {
                            if (voucher.discountType === 'percentage') {
                                discountValue = (orderData.productsPrice * voucher.discountValue) / 100
                            } else {
                                discountValue = voucher.discountValue
                            }
                        }
                    }
                    setOrderData((pre) => ({
                        ...pre,
                        vouchers: [voucher._id],
                    }))
                }
            } catch (error) {
                setErrors('Mã giảm giá không hợp lệ')
                setOrderData((pre) => ({
                    ...pre,
                    vouchers: [],
                }))
            }
        } else {
            setOrderData((pre) => ({
                ...pre,
                vouchers: [],
            }))
        }
        setVoucherInfo((pre) => ({ ...pre, discountValue }))
    }

    const handleQuantityChange = (change) => {
        if (Math.max(0, orderData.products[0].quantity + change) > 0) {
            setOrderData((pre) => ({
                ...pre,
                products: [{ product: variantInfo.variant._id, quantity: pre.products[0].quantity + change }],
            }))
        }
    }

    const handleOrder = async () => {
        if (validate()) {
            try {
                setIsLoading(true)
                if (orderData.paymentMethod === 'bankTransfer') {
                    const response = await axios.post('http://localhost:5000/momo/payment-from-guest', {
                        amount: orderData.totalPrice,
                        orderData,
                        address,
                        url: window.location.href,
                    })
                    const { payUrl } = response.data
                    window.location.href = payUrl
                } else {
                    await dispatch(createOrderFromGuestAction({ orderData, address })).unwrap()
                    setNotification({
                        title: 'Thành công',
                        description:
                            'Đơn hàng đã được tạo thành công, trạng thái đơn hàng sẽ được cập nhật qua email của bạn',
                        type: 'success',
                        show: true,
                    })
                }
            } catch (error) {
                console.log(error)
                setNotification({
                    title: 'Thất bại',
                    description: error.response?.data?.message || error.message,
                    type: 'error',
                    show: true,
                })
            } finally {
                setIsLoading(false)
            }
        }
    }

    const validate = () => {
        if ((!address.name || !address.phone || !address.email || !address.location) && currentStep === 0) {
            setErrors('Vui lòng điền đẩy đủ thông tin')
            return false
        }
        if (
            (!orderData.shippingMethod && !orderData.paymentMethod && currentStep === 1) ||
            (currentStep === 1 && orderData.paymentMethod === 'bankTransfer' && !orderData.transferOption)
        ) {
            setErrors('Vui lòng chọn phương thức vận chuyển và phương thức thanh toán')
            return false
        }

        return true
    }

    useEffect(() => {
        if (errors) {
            setErrors('')
        }
    }, [address, orderData, voucherInfo.code])

    useEffect(() => {
        setOrderData((pre) => ({
            ...pre,
            totalPrice: handlePrice() + orderData.shippingPrice - voucherInfo.discountValue,
            productsPrice: handlePrice(),
        }))
    }, [orderData.shippingPrice, orderData.productsPrice, orderData.vouchers, comboDiscounts])

    useEffect(() => {
        setOrderData((pre) => ({
            ...pre,
            productsPrice: handlePrice(),
        }))
    }, [orderData.products])

    useEffect(() => {
        const calculateDistance = async () => {
            const distance = await calculateRouteDistance(address.address, shopInfo.location)
            if (distance) {
                // let price = 0
                // const distanceValue = distance.distance
                // if (distanceValue <= 500) {
                //     price += Math.ceil(distanceValue) * 100
                // } else {
                //     price += 75000
                // }
                setOrderData((pre) => ({
                    ...pre,
                    expectedDeliveryDate: {
                        startDate: new Date(new Date().setDate(new Date().getDate() + distance.duration)),
                        endDate: new Date(new Date().setDate(new Date().getDate() + distance.duration + 2)),
                    },
                }))
            }
        }
        calculateDistance()
    }, [orderData.shippingMethod, address.address])

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="p-3 d-flex flex-column gap-3">
                        <div className="d-flex gap-3">
                            <div className="d-flex flex-column gap-1 w-50">
                                <label htmlFor="" className="fs-4">
                                    Họ tên
                                </label>
                                <div className={`input-form d-flex align-items-center w-100`}>
                                    <input
                                        value={address.name}
                                        type="text"
                                        className="input-text w-100"
                                        placeholder="Họ tên"
                                        onChange={(e) => handleAddressChange('name', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-1 w-50">
                                <label htmlFor="" className="fs-4">
                                    Số điện thoại
                                </label>
                                <div className={`input-form d-flex align-items-center w-100`}>
                                    <input
                                        value={address.phone}
                                        type="number"
                                        className="input-text w-100"
                                        placeholder="Số điện thoại"
                                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-1">
                            <label htmlFor="" className="fs-4">
                                Email
                            </label>
                            <div className={`input-form d-flex align-items-center w-100`}>
                                <input
                                    value={address.email}
                                    type="email"
                                    className="input-text w-100"
                                    placeholder="Email"
                                    onChange={(e) => handleAddressChange('email', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-1">
                            <label htmlFor="" className="fs-4">
                                Địa chỉ
                            </label>
                            <div className={`input-form d-flex align-items-center w-100`}>
                                <input
                                    value={address.location}
                                    type="text"
                                    className="input-text w-100"
                                    placeholder="Địa chỉ"
                                    onChange={(e) => handleAddressChange('location', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="">
                            <TomTomMap
                                initialLocation={address.address}
                                onLocationChange={(value) => handleAddressChange('address', value)}
                                height="220px"
                                setLocation={(value) => handleAddressChange('location', value)}
                            />
                        </div>
                    </div>
                )
            case 1:
                return (
                    <div className="p-3 d-flex flex-column gap-4">
                        <div className="d-flex flex-column gap-2 p-4 shadow rounded-4 border-top border-5 border-theme">
                            <label htmlFor="" className="fs-3 fw-medium">
                                Phương thức vận chuyển
                            </label>
                            <div className="d-flex align-items-center justify-content-between py-3">
                                <p className="fs-4 w-25 fw-bold theme-color">Vận chuyển cơ bản</p>
                                <div className="d-flex align-items-center gap-3">
                                    {product.shippingInfo?.find((info) => info.type === 'basic') ? (
                                        <p className="fs-3 fw-medium">
                                            {product.shippingInfo
                                                .find((info) => info.type === 'basic')
                                                .price.toLocaleString('vi-VN') + 'đ'}
                                        </p>
                                    ) : (
                                        <p className="fs-4 fw-medium text-secondary">Không có sẵn</p>
                                    )}
                                    <input
                                        type="checkbox"
                                        checked={orderData.shippingMethod === 'basic'}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setOrderData((pre) => ({
                                                    ...pre,
                                                    shippingMethod: 'basic',
                                                    shippingPrice: product.shippingInfo.find(
                                                        (info) => info.type === 'basic'
                                                    ).price,
                                                }))
                                            } else {
                                                setOrderData((pre) => ({
                                                    ...pre,
                                                    shippingMethod: null,
                                                    shippingPrice: 0,
                                                }))
                                            }
                                        }}
                                        disabled={!product.shippingInfo?.find((info) => info.type === 'basic')}
                                        className="theme-checkbox"
                                    />
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between py-3">
                                <p className="fs-4 w-25 fw-bold theme-color">Vận chuyển nhanh</p>
                                <div className="d-flex align-items-center gap-3">
                                    {product.shippingInfo?.find((info) => info.type === 'fast') ? (
                                        <p className="fs-3 fw-medium">
                                            {product.shippingInfo
                                                .find((info) => info.type === 'fast')
                                                .price.toLocaleString('vi-VN') + 'đ'}
                                        </p>
                                    ) : (
                                        <p className="fs-4 fw-medium text-secondary">Không có sẵn</p>
                                    )}
                                    <input
                                        type="checkbox"
                                        checked={orderData.shippingMethod === 'fast'}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setOrderData((pre) => ({
                                                    ...pre,
                                                    shippingMethod: 'fast',
                                                    shippingPrice: product.shippingInfo.find(
                                                        (info) => info.type === 'fast'
                                                    ).price,
                                                }))
                                            } else {
                                                setOrderData((pre) => ({
                                                    ...pre,
                                                    shippingMethod: null,
                                                    shippingPrice: 0,
                                                }))
                                            }
                                        }}
                                        disabled={!product.shippingInfo?.find((info) => info.type === 'fast')}
                                        className="theme-checkbox"
                                    />
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between py-3 ">
                                <p className="fs-4 w-25 fw-bold theme-color">Vận chuyển hỏa tốc</p>
                                <div className="d-flex align-items-center gap-3">
                                    {product.shippingInfo?.find((info) => info.type === 'express') ? (
                                        <p className="fs-3 fw-medium">
                                            {product.shippingInfo
                                                .find((info) => info.type === 'express')
                                                .price.toLocaleString('vi-VN') + 'đ'}
                                        </p>
                                    ) : (
                                        <p className="fs-4 fw-medium text-secondary">Không có sẵn</p>
                                    )}
                                    <input
                                        type="checkbox"
                                        checked={orderData.shippingMethod === 'express'}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setOrderData((pre) => ({
                                                    ...pre,
                                                    shippingMethod: 'express',
                                                    shippingPrice: product.shippingInfo.find(
                                                        (info) => info.type === 'express'
                                                    ).price,
                                                }))
                                            } else {
                                                setOrderData((pre) => ({
                                                    ...pre,
                                                    shippingMethod: null,
                                                    shippingPrice: 0,
                                                }))
                                            }
                                        }}
                                        disabled={!product.shippingInfo?.find((info) => info.type === 'express')}
                                        className="theme-checkbox"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-2 p-4 shadow rounded-4 border-top border-5 border-theme">
                            <label htmlFor="" className="fs-3 fw-medium">
                                Phương thức thanh toán
                            </label>
                            <div className="d-flex align-items-center justify-content-between py-3 ">
                                <p className="fs-4 w-25 fw-bold theme-color text-nowrap">Thanh toán khi nhận hàng</p>
                                <div className="d-flex align-items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={orderData.paymentMethod === 'paymentUponReceipt'}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setOrderData((pre) => ({ ...pre, paymentMethod: 'paymentUponReceipt' }))
                                            } else {
                                                setOrderData((pre) => ({ ...pre, paymentMethod: null }))
                                            }
                                        }}
                                        className="theme-checkbox"
                                    />
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between py-3 ">
                                <p className="fs-4 w-25 fw-bold theme-color text-nowrap">Thanh toán chuyển khoản</p>
                                <div className="d-flex align-items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={orderData.paymentMethod === 'bankTransfer'}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setOrderData((pre) => ({ ...pre, paymentMethod: 'bankTransfer' }))
                                            } else {
                                                setOrderData((pre) => ({ ...pre, paymentMethod: null }))
                                            }
                                        }}
                                        className="theme-checkbox"
                                    />
                                </div>
                            </div>
                            {orderData.paymentMethod === 'bankTransfer' && (
                                <div className="d-flex gap-3 px-2">
                                    <div className="d-flex flex-column gap-2 align-items-center">
                                        <div className="d-flex align-items-center gap-3">
                                            <label className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    className="input-checkbox"
                                                    checked={orderData.transferOption === 'momo'}
                                                    onChange={(e) =>
                                                        setOrderData((pre) => ({
                                                            ...pre,
                                                            transferOption: e.target.checked ? 'momo' : null,
                                                        }))
                                                    }
                                                />
                                                <span className="custom-checkbox"></span>
                                            </label>
                                            <p className="fs-3">ví MoMo</p>
                                        </div>
                                        <img
                                            src={
                                                'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png'
                                            }
                                            alt="momo"
                                            style={{ width: '35px', height: '35px' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="p-3 d-flex flex-column gap-4">
                        <div className="p-4 pt-3 d-flex flex-column gap-3 shadow rounded-4 border-top border-5 border-theme">
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex gap-3">
                                    <p className="fs-4 fw-medium w-50">
                                        <strong className="theme-color">Họ tên:</strong> {address.name}
                                    </p>
                                    <p className="fs-4 fw-medium w-50">
                                        <strong className="theme-color">Số điện thoại:</strong> {address.phone}
                                    </p>
                                </div>
                                <p className="fs-4 fw-medium">
                                    <strong className="theme-color">Địa chỉ:</strong> {address.location}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-2 p-4 pt-3 shadow rounded-4 border-top border-5 border-theme">
                            <div className="d-flex justify-content-between">
                                <p className="fs-4 fw-medium">
                                    <strong className="theme-color">Phương thức vận chuyển:</strong>{' '}
                                    {orderData.shippingMethod === 'basic'
                                        ? 'Vận chuyển cơ bản'
                                        : orderData.shippingMethod === 'fast'
                                        ? 'Vận chuyển nhanh'
                                        : 'Vận chuyển hỏa tốc'}
                                </p>
                                <p className="fs-4 fw-medium">
                                    {orderData.shippingPrice.toLocaleString('vi-VN') + 'đ'}
                                </p>
                            </div>
                            <p className="fs-4 fw-medium position-relative">
                                <strong className="theme-color">Phương thức thanh toán:</strong>{' '}
                                {orderData.paymentMethod === 'paymentUponReceipt'
                                    ? 'Thanh toán khi nhận hàng'
                                    : 'Thanh toán chuyển khoản'}
                                {orderData.paymentMethod === 'bankTransfer' && (
                                    <span className="fs-4 fw-medium position-absolute top-0 end-0">
                                        {orderData.transferOption === 'momo' ? 'ví MoMo' : 'Khác'}
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="d-flex flex-column gap-2 p-4 pt-3 shadow rounded-4 border-top border-5 border-theme">
                            <div className="checkout-process_product d-grid">
                                <p className="fs-4 fw-medium">Sản phẩm</p>
                                <p className="fs-4 fw-medium text-center">Giá</p>
                                <p className="fs-4 fw-medium text-center">Số lượng</p>
                                <p className="fs-4 fw-medium text-center">Tổng</p>
                            </div>
                            <div className="d-grid checkout-process_product">
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={product?.urlImage[0]}
                                        alt="Sản phẩm"
                                        className="checkout-process_product-img"
                                    />
                                    <div className="d-flex flex-column gap-1">
                                        <p className="fs-3 fw-medium checkout-process_product-name">{product?.name}</p>
                                        {variantInfo.color && <p className="fs-5 ">Màu: {variantInfo.color}</p>}
                                        {variantInfo.size && <p className="fs-5 ">Size: {variantInfo.size}</p>}
                                    </div>
                                </div>
                                <p className="fs-4 fw-medium text-center">
                                    {variantInfo.variant.price.toLocaleString('vi-VN') + 'đ'}
                                </p>
                                <div className="d-flex align-items-center justify-content-center px-1 py-1 rounded-4 border border-black">
                                    <FontAwesomeIcon
                                        icon={faMinus}
                                        size="lg"
                                        className="p-4"
                                        onClick={() => handleQuantityChange(-1)}
                                    />
                                    <p className="fs-3 fw-medium lh-1 mx-2">{orderData.products[0]?.quantity}</p>
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        size="lg"
                                        className="p-4"
                                        onClick={() => handleQuantityChange(1)}
                                    />
                                </div>
                                <p className="fs-4 fw-medium text-center">
                                    {handlePrice().toLocaleString('vi-VN') + 'đ'}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex gap-2 p-4 pt-3 shadow rounded-4 border-top border-5 border-theme">
                            <div className="d-grid checkout-process_discount w-100">
                                <div className="d-flex gap-2 align-items-center">
                                    <p className="fs-4 fw-medium text-nowrap">Mã giảm giá</p>
                                    <div className="input-form d-flex align-items-center gap-3 w-100">
                                        <input
                                            type="text"
                                            className="input-text w-100"
                                            placeholder="Mã giảm giá"
                                            value={voucherInfo.code}
                                            onChange={(e) =>
                                                setVoucherInfo((pre) => ({ ...pre, code: e.target.value }))
                                            }
                                        />
                                    </div>
                                </div>
                                <button className="primary-btn px-4 py-2" onClick={handleVoucher}>
                                    <p className="m-0">Áp dụng</p>
                                </button>
                                <p className="fs-4 fw-medium text-center">
                                    {'-' + voucherInfo.discountValue.toLocaleString('vi-VN') + 'đ'}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2 align-items-center mx-2">
                            <p className="fs-4 fw-medium">Tổng tiền:</p>
                            <p className="fs-3 fw-medium theme-color">
                                {orderData.totalPrice.toLocaleString('vi-VN') + 'đ'}
                            </p>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <>
            <Modal show={true} onHide={onClose} centered size="lg" className="p-4">
                <div className="position-relative my-4 p-2">
                    <div className="checkout-process_container d-flex justify-content-between gap-5">
                        <div
                            className="process-line"
                            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                        />
                        {STEPS.map((step, index) => (
                            <div key={index} className="position-relative">
                                <button
                                    className={`checkout-process_step rounded-circle ${
                                        index === currentStep ? 'active' : ''
                                    } ${index < currentStep ? 'completed' : ''}`}
                                    onClick={() => index <= currentStep && setCurrentStep(index)}
                                >
                                    <FontAwesomeIcon
                                        icon={index < currentStep ? faCheck : step.icon}
                                        className="fs-3"
                                    />
                                </button>
                                <span className={`checkout-process_label ${index === currentStep ? 'active' : ''}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <Modal.Body className="checkout-process_content">{renderStepContent()}</Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <button
                        className="primary-btn px-4 py-2"
                        onClick={() => currentStep > 0 && setCurrentStep((prev) => prev - 1)}
                        disabled={currentStep === 0}
                    >
                        <p className="m-0">Quay lại</p>
                    </button>
                    {errors && <p className="text-danger fs-4 fw-bold">{errors}</p>}
                    <button
                        className="primary-btn px-4 py-2"
                        onClick={() =>
                            (validate() && currentStep < STEPS.length - 1 && setCurrentStep((prev) => prev + 1)) ||
                            (currentStep === STEPS.length - 1 && handleOrder())
                        }
                        disabled={isLoading}
                    >
                        <p className="m-0">{currentStep === STEPS.length - 1 ? 'Đặt hàng' : 'Tiếp tục'}</p>
                        {isLoading && (
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
                </Modal.Footer>
            </Modal>
            {notification.show && (
                <Modal
                    show={notification.show}
                    onHide={() => {
                        setNotification({ ...notification, show: false })
                        if (notification.type === 'success') {
                            onClose()
                        }
                    }}
                    centered
                >
                    <Notification
                        title={notification.title}
                        description={notification.description}
                        type={notification.type}
                    />
                </Modal>
            )}
        </>
    )
}

export default CheckoutProcess
