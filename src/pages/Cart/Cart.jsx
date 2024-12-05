import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPen, faPlus, faTicket } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import Modal from 'react-bootstrap/Modal'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart, updateItemQuantity, removeItemFromCart } from '../../redux/slices/cartSlice'
import { fetchAddresses } from '../../redux/slices/userSlice'
import { getShopInfo } from '../../redux/slices/shopSlice'
import { createOrderAction } from '../../redux/slices/orderSilce'
import { getPromotionalComboByProductIdAction } from '../../redux/slices/promotionalComboSlice'

import { calculateRouteDistance } from '../../utils/MapUtils'
import SelectAddressModal from '../../components/SelectAddressModal'
import Notification from '../../components/Notification'
import ShippingMethodModal from '../../components/ShippingMethodModal'
import VoucherModal from '../../components/VoucherModal'
import PaymentMethodModal from '../../components/PaymentMethodModal'
import './Cart.scss'

function Cart() {
    const dispatch = useDispatch()
    const { cart, status } = useSelector((state) => state.cart)
    const { addresses } = useSelector((state) => state.user)
    const { shopInfo } = useSelector((state) => state.shop)
    const navigate = useNavigate()
    const location = useLocation()

    //modal
    const [showVoucher, setShowVoucher] = useState(false)
    const [showAddress, setShowAddress] = useState(false)
    const [showPaymentMethod, setShowPaymentMethod] = useState(false)
    const [showShippingMethod, setShowShippingMethod] = useState(false)
    const [discountValue, setDiscountValue] = useState({
        value: 0,
        shipping: 0,
    })
    // state
    const [orderData, setOrderData] = useState({
        products: [],
        paymentMethod: 'paymentUponReceipt',
        productsPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
        shippingAddress: {},
        vouchers: [],
        shippingMethod: 'basic',
        expectedDeliveryDate: {
            startDate: null,
            endDate: null,
        },
        transferOption: null,
    })
    // notification
    const [notification, setNotification] = useState({
        show: false,
        description: '',
        type: '',
        title: '',
    })
    const [isLoading, setIsLoading] = useState({
        shipping: false,
        order: false,
    })
    const [comboDiscounts, setComboDiscounts] = useState([])

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const resultCode = searchParams.get('resultCode')
        if (resultCode) {
            if (resultCode === '0') {
                setNotification({
                    show: true,
                    description: 'Đơn hàng đã được đặt thành công',
                    type: 'success',
                    title: 'Thành công',
                    onClose: () => {
                        navigate('/cart', { replace: true })
                    },
                })
            } else {
                setNotification({
                    show: true,
                    description: 'Thanh toán thất bại',
                    type: 'error',
                    title: 'Lỗi',
                    onClose: () => {
                        navigate('/cart', { replace: true })
                    },
                })
            }
        }
    }, [location])

    useEffect(() => {
        const fetchCombos = async () => {
            const promises = cart.items.map((item) =>
                dispatch(getPromotionalComboByProductIdAction(item.variant.product._id))
            )
            const results = await Promise.all(promises)
            const comboDiscounts = results.map((result) => (result.payload ? result.payload : [])).flat()
            const finalCombos = [...new Set(comboDiscounts)]
            setComboDiscounts(finalCombos)
        }
        if (cart.items?.length > 0) {
            fetchCombos()
        }
    }, [cart.items])

    useEffect(() => {
        dispatch(fetchCart())
        dispatch(fetchAddresses())
        dispatch(getShopInfo())
    }, [dispatch])

    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddress = addresses.find((address) => address.default === true)
            if (defaultAddress) {
                setOrderData({
                    ...orderData,
                    shippingAddress: defaultAddress,
                })
            }
        }
    }, [addresses])

    const handleChangeOrderData = (key, value) => {
        setOrderData({
            ...orderData,
            [key]: value,
        })
    }

    const confirmShippingMethod = (shippingMethod) => {
        setOrderData({
            ...orderData,
            shippingMethod,
        })
        setShowShippingMethod(false)
    }

    useEffect(() => {
        let value = 0
        let shipping = 0
        const totalPrice =
            orderData.productsPrice +
            orderData.shippingPrice -
            orderData.vouchers.reduce((total, voucher) => {
                let originalValue = 0
                let finalValue = 0
                if (voucher.voucherType === 'shipping') {
                    originalValue = orderData.shippingPrice
                } else {
                    originalValue = orderData.productsPrice + orderData.shippingPrice
                }
                if (voucher.discountType === 'percentage') {
                    const valueDiscount = (originalValue * voucher.discountValue) / 100
                    if (valueDiscount > voucher.maxDiscountValue) {
                        finalValue = voucher.maxDiscountValue
                    } else {
                        finalValue = valueDiscount
                    }
                } else {
                    finalValue = voucher.discountValue
                }
                if (voucher.voucherType === 'shipping') {
                    shipping += finalValue
                } else {
                    value += finalValue
                }
                return total + finalValue
            }, 0)
        setOrderData((pre) => ({
            ...pre,
            totalPrice,
        }))
        setDiscountValue({
            value,
            shipping,
        })
    }, [orderData.vouchers])

    useEffect(() => {
        calculateTotalShippingPrice()
    }, [orderData.shippingAddress, orderData.shippingMethod, orderData.products])

    const calculateTotalShippingPrice = async () => {
        if (shopInfo && Object.keys(orderData.shippingAddress).length > 0 && addresses.length > 0) {
            if (orderData.products.length > 0) {
                try {
                    setIsLoading((pre) => ({
                        ...pre,
                        shipping: true,
                    }))
                    const distance = await calculateRouteDistance(orderData.shippingAddress.address, shopInfo.location)
                    if (distance) {
                        let price = 0
                        const distanceValue = distance.distance
                        if (distanceValue <= 500) {
                            price += Math.ceil(distanceValue) * 100
                        } else {
                            price += 75000
                        }
                        if (orderData.products.length > 0) {
                            const productsPrice = orderData.products.reduce((total, item) => {
                                if (orderData.shippingMethod === 'basic') {
                                    return (
                                        total +
                                        cart.items
                                            .find((cartItem) => cartItem.variant._id === item.product)
                                            ?.variant.product?.shippingInfo?.find((info) => info.type === 'basic')
                                            ?.price *
                                            item.quantity
                                    )
                                } else if (orderData.shippingMethod === 'fast') {
                                    return (
                                        total +
                                        cart.items
                                            .find((cartItem) => cartItem.variant._id === item.product)
                                            ?.variant.product?.shippingInfo?.find((info) => info.type === 'fast')
                                            ?.price *
                                            item.quantity
                                    )
                                } else {
                                    return (
                                        total +
                                        cart.items
                                            .find((cartItem) => cartItem.variant._id === item.product)
                                            ?.variant.product?.shippingInfo?.find((info) => info.type === 'express')
                                            ?.price *
                                            item.quantity
                                    )
                                }
                            }, 0)
                            price += productsPrice
                        }
                        const totalPrice = orderData.productsPrice + price
                        setOrderData({
                            ...orderData,
                            shippingPrice: price,
                            expectedDeliveryDate: {
                                startDate: new Date(new Date().setDate(new Date().getDate() + distance.duration)),
                                endDate: new Date(new Date().setDate(new Date().getDate() + distance.duration + 2)),
                            },
                            totalPrice,
                            vouchers: [],
                        })
                    }
                } catch (error) {
                    setNotification({
                        show: true,
                        description: error.message,
                        type: 'error',
                        title: 'Lỗi',
                    })
                } finally {
                    setIsLoading((pre) => ({
                        ...pre,
                        shipping: false,
                    }))
                }
            } else {
                setOrderData({
                    ...orderData,
                    shippingPrice: 0,
                    expectedDeliveryDate: {
                        startDate: null,
                        endDate: null,
                    },
                    totalPrice: 0,
                    vouchers: [],
                })
            }
        } else {
            if (orderData.vouchers.length > 0) {
                setOrderData({
                    ...orderData,
                    vouchers: [],
                })
            }
        }
    }

    const handleSelectItem = (item) => {
        setOrderData((prev) => {
            if (prev.products.some((product) => product.product === item.variant._id)) {
                const productsPrice = prev.productsPrice - handleComboDiscountValue(item)
                return {
                    ...prev,
                    products: prev.products.filter((product) => product.product !== item.variant._id),
                    productsPrice,
                    totalPrice: productsPrice + prev.shippingPrice,
                }
            } else {
                const productsPrice = prev.productsPrice + handleComboDiscountValue(item)
                return {
                    ...prev,
                    products: [...prev.products, { product: item.variant._id, quantity: item.quantity }],
                    productsPrice,
                    totalPrice: productsPrice + prev.shippingPrice,
                }
            }
        })
    }

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setOrderData((prev) => ({
                ...prev,
                products: cart.items.map((item) => ({
                    product: item.variant._id,
                    quantity: item.quantity,
                })),
                productsPrice: cart.items.reduce((total, item) => total + handleComboDiscountValue(item), 0),
                totalPrice:
                    cart.items.reduce((total, item) => total + handleComboDiscountValue(item), 0) + prev.shippingPrice,
            }))
        } else {
            setOrderData((prev) => ({
                ...prev,
                products: [],
                productsPrice: 0,
                totalPrice: 0,
            }))
        }
    }

    const handleOrder = async () => {
        if (orderData.products.length > 0) {
            const finalOrderData = {
                ...orderData,
                shippingAddress: orderData.shippingAddress._id,
                vouchers: orderData.vouchers.map((voucher) => voucher._id),
            }
            try {
                setIsLoading((pre) => ({
                    ...pre,
                    order: true,
                }))
                if (orderData.paymentMethod === 'bankTransfer' && orderData.transferOption === 'momo') {
                    const response = await axios.post(
                        'http://localhost:5000/momo/payment',
                        {
                            amount: orderData.totalPrice,
                            orderData: finalOrderData,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        }
                    )
                    const { payUrl } = response.data
                    window.location.href = payUrl
                } else {
                    await dispatch(createOrderAction(finalOrderData)).unwrap()
                    setNotification({
                        show: true,
                        description: 'Đặt hàng thành công',
                        type: 'success',
                        title: 'Thành công',
                        onClose: () => {
                            window.location.reload()
                        },
                    })
                }
            } catch (error) {
                setNotification({
                    show: true,
                    description: error.response?.data?.message || error.message,
                    type: 'error',
                    title: 'Lỗi',
                })
            } finally {
                setIsLoading((pre) => ({
                    ...pre,
                    order: false,
                }))
            }
        }
    }

    const handleQuantityChange = async (item, change) => {
        const oldValue = handleComboDiscountValue(item)
        const newQuantity = Math.max(1, item.quantity + change)
        await dispatch(updateItemQuantity({ itemId: item._id, quantity: newQuantity })).unwrap()
        console.log(handleComboDiscountValue(item, newQuantity), orderData.productsPrice, oldValue, newQuantity)
        if (orderData.products.some((product) => product.product === item.variant._id)) {
            setOrderData((prev) => ({
                ...prev,
                products: prev.products.map((product) =>
                    product.product === item.variant._id ? { ...product, quantity: newQuantity } : product
                ),
                productsPrice: prev.productsPrice - oldValue + handleComboDiscountValue(item, newQuantity),
            }))
        }
    }

    const handleRemoveItem = async (item) => {
        await dispatch(removeItemFromCart(item._id)).unwrap()
        if (orderData.products.some((product) => product.product === item.variant._id)) {
            setOrderData((prev) => ({
                ...prev,
                products: prev.products.filter((product) => product.product !== item.variant._id),
                productsPrice: prev.productsPrice - handleComboDiscountValue(item),
            }))
        }
    }

    const handleCloseVoucher = () => setShowVoucher(false)
    const handleShowVoucher = () => setShowVoucher(true)
    const handleCloseAddress = () => setShowAddress(false)
    const handleShowAddress = () => setShowAddress(true)
    const handleClosePaymentMethod = () => setShowPaymentMethod(false)
    const handleShowPaymentMethod = () => setShowPaymentMethod(true)

    if (status === 'loading') {
        return (
            <section className="dots-container mt-4">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </section>
        )
    }

    const handleComboDiscountValue = (item, newQuantity = null) => {
        const combo = comboDiscounts.find((combo) => combo.products.includes(item.variant.product._id))
        if (combo) {
            if (newQuantity ? newQuantity <= combo.limitCombo : item.quantity <= combo.limitCombo) {
                let discountValue = 0
                for (let i = 0; i < combo.discountCombos.length; i++) {
                    if (
                        newQuantity
                            ? newQuantity >= combo.discountCombos[i].quantity
                            : item.quantity >= combo.discountCombos[i].quantity
                    ) {
                        discountValue = combo.discountCombos[i].discountValue
                    }
                }
                if (combo.comboType === 'percentage') {
                    return (
                        (newQuantity ? newQuantity : item.quantity) *
                        item.variant.price *
                        (1 - discountValue / 100) *
                        (1 - item.variant.product.discount / 100)
                    )
                } else {
                    return (
                        (newQuantity ? newQuantity : item.quantity) * item.variant.price -
                        discountValue * (1 - item.variant.product.discount / 100)
                    )
                }
            }
        }
        return (
            (newQuantity ? newQuantity : item.quantity) * item.variant.price * (1 - item.variant.product.discount / 100)
        )
    }

    return (
        <>
            <div className="container h-100 px-5 py-5">
                <p className="fw-bold fs-2">Giỏ hàng</p>
                <div className="d-flex">
                    <div className="mt-2 me-4" style={{ width: '60%' }}>
                        {status === 'failed' ? (
                            <p className="text-center fs-3">Lỗi khi lấy giỏ hàng</p>
                        ) : status === 'succeeded' && cart.items.length === 0 ? (
                            <div className="text-center">
                                <p className="fs-3 fw-medium">Giỏ hàng của bạn còn trống</p>
                                <button
                                    className="primary-btn px-4 py-2 shadow-none mt-3"
                                    onClick={() => navigate('/products')}
                                >
                                    <p>Mua ngay</p>
                                </button>
                            </div>
                        ) : (
                            status === 'succeeded' &&
                            cart.items.length > 0 && (
                                <>
                                    <div className="d-flex pb-3 border-bottom">
                                        <div className="d-flex" style={{ width: '40%' }}>
                                            <label className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    className="input-checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={orderData.products.length === cart.items.length}
                                                />
                                                <span className="custom-checkbox"></span>
                                            </label>
                                            <p className="fs-3 ms-3 fw-medium ">Sản phẩm</p>
                                        </div>
                                        <p className="fs-3 fw-medium flex-grow-1 text-center">Giá</p>
                                        <p className="fs-3 fw-medium flex-grow-1 text-center">Số lượng</p>
                                        <p className="fs-3 fw-medium flex-grow-1 text-center">Tổng</p>
                                    </div>
                                    <div className="" style={{ maxHeight: 1000, overflowY: 'auto' }}>
                                        {cart.items.map((item) => (
                                            <div
                                                key={item._id}
                                                className="d-flex py-3 border-bottom align-items-center"
                                            >
                                                <div className="d-flex align-items-center" style={{ width: '40%' }}>
                                                    <label className="d-flex align-items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="input-checkbox"
                                                            checked={orderData.products.some(
                                                                (product) => product.product === item.variant._id
                                                            )}
                                                            onChange={(e) => {
                                                                handleSelectItem(item)
                                                            }}
                                                        />
                                                        <span className="custom-checkbox"></span>
                                                    </label>
                                                    <img
                                                        className="mx-3"
                                                        src={item.variant.product?.urlImage}
                                                        alt=""
                                                        width={70}
                                                        height={70}
                                                    />
                                                    <div className="flex-grow-1">
                                                        <p
                                                            className="fs-3 fw-medium product-name"
                                                            style={{ maxWidth: '80%' }}
                                                        >
                                                            {item.variant.product?.name}
                                                        </p>
                                                        {item.variant.size && (
                                                            <p className="fw-medium">Size: {item.variant.size}</p>
                                                        )}
                                                        {item.variant.color && (
                                                            <p className="fw-medium">Màu: {item.variant.color}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 m-auto">
                                                    <p className="text-center fs-3">{item.variant.price}đ</p>
                                                </div>
                                                <div className="flex-grow-1 justify-content-center d-flex">
                                                    <div className="d-flex align-items-center justify-content-center px-1 py-1 rounded-4 border border-black my-4">
                                                        <FontAwesomeIcon
                                                            icon={faMinus}
                                                            size="lg"
                                                            className="p-4"
                                                            onClick={(e) => {
                                                                if (item.quantity > 1) {
                                                                    handleQuantityChange(item, -1)
                                                                }
                                                            }}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                        <p className="fs-3 fw-medium lh-1 mx-2">{item.quantity}</p>
                                                        <FontAwesomeIcon
                                                            icon={faPlus}
                                                            size="lg"
                                                            className="p-4"
                                                            onClick={(e) => {
                                                                handleQuantityChange(item, 1)
                                                            }}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 m-auto">
                                                    <p className="text-center fs-3">
                                                        {handleComboDiscountValue(item)}đ
                                                    </p>
                                                </div>
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                    className="fs-3 p-2 hover-icon"
                                                    color="#ff7262"
                                                    onClick={(e) => {
                                                        handleRemoveItem(item)
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )
                        )}
                    </div>
                    <div className="p-4" style={{ width: '40%' }}>
                        <div className="w-100 h-100 border p-3">
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium ">Tổng tiền hàng:</p>
                                <p className="fs-3 ">{orderData.productsPrice}đ</p>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium ">
                                    <FontAwesomeIcon icon={faTicket} className="fs-2" /> Mã giảm giá
                                </p>
                                <div className="d-flex align-items-center">
                                    {discountValue.value > 0 && (
                                        <p className="fs-4 fw-medium p-2 me-2 border border-primary-subtle text-info">{`${Math.round(
                                            discountValue.value / 1000
                                        )}K`}</p>
                                    )}
                                    {discountValue.shipping > 0 && (
                                        <p className="fs-4 fw-medium p-2 border border-success-subtle text-success-emphasis me-2">{`${Math.round(
                                            discountValue.shipping / 1000
                                        )}K`}</p>
                                    )}
                                    <div className="primary-btn px-2 py-1 shadow-none" onClick={handleShowVoucher}>
                                        <p>Chọn</p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium text-wrap" style={{ maxWidth: 120 }}>
                                    Phương thức vận chuyển:
                                </p>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        {isLoading.shipping ? (
                                            <section className="dots-container ">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </section>
                                        ) : (
                                            <>
                                                <p className="fs-3 fw-medium text-end">
                                                    {(orderData.shippingMethod === 'basic' && 'Cơ bản') ||
                                                        (orderData.shippingMethod === 'fast' && 'Nhanh') ||
                                                        (orderData.shippingMethod === 'express' && 'Hỏa tốc')}
                                                    <span className="fs-4 text-body-tertiary ms-2">
                                                        {orderData.shippingPrice}đ
                                                    </span>
                                                </p>
                                            </>
                                        )}
                                        {orderData.expectedDeliveryDate.startDate &&
                                            orderData.expectedDeliveryDate.endDate && (
                                                <p className="fs-4">
                                                    Đảm bảo nhận hàng từ{' '}
                                                    {orderData.expectedDeliveryDate.startDate.toLocaleDateString(
                                                        'vi-VN'
                                                    )}{' '}
                                                    đến{' '}
                                                    {orderData.expectedDeliveryDate.endDate.toLocaleDateString('vi-VN')}
                                                </p>
                                            )}
                                    </div>
                                    <FontAwesomeIcon
                                        icon={faPen}
                                        color="#4a90e2"
                                        className="hover-icon fs-2 ms-2 p-2"
                                        onClick={() => setShowShippingMethod(true)}
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium text-nowrap">Địa chỉ:</p>
                                <div className="d-flex align-items-center">
                                    <div className="ms-3">
                                        {Object.keys(orderData.shippingAddress).length > 0 ? (
                                            <>
                                                <p className="fs-3">{orderData.shippingAddress?.name}</p>
                                                <p className="fs-3">{orderData.shippingAddress?.phone}</p>
                                                <p className="fs-3 fw-medium product-name">
                                                    {orderData.shippingAddress?.location}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="fs-3 text-danger">Chưa chọn địa chỉ</p>
                                        )}
                                    </div>
                                    <FontAwesomeIcon
                                        icon={faPen}
                                        color="#4a90e2"
                                        className="hover-icon fs-2 ms-2 p-2"
                                        onClick={handleShowAddress}
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium text-wrap" style={{ maxWidth: 120 }}>
                                    Phương thức thanh toán:
                                </p>
                                <div className="d-flex align-items-center gap-2">
                                    {orderData.paymentMethod === 'bankTransfer' && (
                                        <img
                                            src={
                                                orderData.transferOption === 'momo'
                                                    ? 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png'
                                                    : 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png'
                                            }
                                            alt="payment method"
                                            width={50}
                                            height={50}
                                        />
                                    )}
                                    <p className="fs-3">
                                        {orderData.paymentMethod === 'paymentUponReceipt' && 'Khi nhận hàng'}
                                        {(orderData.paymentMethod === 'bankTransfer' &&
                                            orderData.transferOption === 'momo' &&
                                            'Ví MoMo') ||
                                            (orderData.transferOption === 'bank' && 'Chuyển khoản')}
                                    </p>
                                    <FontAwesomeIcon
                                        icon={faPen}
                                        color="#4a90e2"
                                        className="hover-icon fs-2 ms-2 p-2"
                                        onClick={handleShowPaymentMethod}
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-bolder ">Tổng tiền:</p>
                                <p className="fs-3 fw-bolder">{orderData.totalPrice}đ</p>
                            </div>
                            <div className="text-center py-3">
                                <button
                                    disabled={
                                        orderData.products.length === 0 ||
                                        orderData.shippingAddress === null ||
                                        Object.keys(orderData.shippingAddress).length === 0 ||
                                        orderData.paymentMethod === null ||
                                        isLoading.order ||
                                        isLoading.shipping
                                    }
                                    className="primary-btn shadow-none px-5 py-3"
                                    onClick={handleOrder}
                                >
                                    {isLoading.order && (
                                        <div className="dot-spinner ms-4">
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                        </div>
                                    )}
                                    <p>Đặt hàng</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {notification.show && (
                <Modal
                    show={notification.show}
                    onHide={() => {
                        if (notification.onClose) {
                            notification.onClose()
                        }
                        setNotification({ ...notification, show: false })
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
            {showShippingMethod && (
                <ShippingMethodModal
                    showShippingMethod={showShippingMethod}
                    setShowShippingMethod={setShowShippingMethod}
                    orderData={orderData}
                    cart={cart}
                    confirmShippingMethod={confirmShippingMethod}
                    originalShippingMethod={orderData.shippingMethod}
                />
            )}
            {/* Modal Voucher */}
            {showVoucher && (
                <VoucherModal
                    cart={cart}
                    showVoucher={showVoucher}
                    handleCloseVoucher={handleCloseVoucher}
                    orderData={orderData}
                    setOrderData={setOrderData}
                    originalVouchers={orderData.vouchers}
                />
            )}
            {showAddress && (
                <SelectAddressModal
                    showAddress={showAddress}
                    handleCloseAddress={handleCloseAddress}
                    addresses={addresses}
                    originalSelectedAddress={orderData.shippingAddress}
                    handleSelectAddress={(address) => handleChangeOrderData('shippingAddress', address)}
                />
            )}
            {/* Modal Payment Method*/}
            {showPaymentMethod && (
                <PaymentMethodModal
                    showPaymentMethod={showPaymentMethod}
                    handleClosePaymentMethod={handleClosePaymentMethod}
                    orderData={orderData}
                    setOrderData={setOrderData}
                />
            )}
        </>
    )
}

export default Cart
