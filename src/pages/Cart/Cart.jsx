import './Cart.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPen, faPlus, faTicket } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import Modal from 'react-bootstrap/Modal'
import { useState, useEffect, useLayoutEffect } from 'react'
import { fetchCart, updateItemQuantity, removeItemFromCart } from '../../redux/slices/cartSlice'
import { fetchAddresses } from '../../redux/slices/userSlice'
import { createOrderAction } from '../../redux/slices/orderSilce'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SelectAddressModal from '../../components/SelectAddressModal'
import Notification from '../../components/Notification'

function Cart() {
    const dispatch = useDispatch()
    const { cart, status } = useSelector((state) => state.cart)
    const { addresses } = useSelector((state) => state.user)
    const navigate = useNavigate()

    //modal
    const [showVoucher, setShowVoucher] = useState(false)
    const [showAddress, setShowAddress] = useState(false)
    const [showPaymentMethod, setShowPaymentMethod] = useState(false)
    // state
    const [orderData, setOrderData] = useState({
        products: [],
        paymentMethod: 'paymentUponReceipt',
        productsPrice: 0,
        shippingPrice: 30000,
        totalPrice: 0,
        shippingAddress: {},
        vouchers: [],
    })
    // notification
    const [notification, setNotification] = useState({
        show: false,
        description: '',
        type: '',
        title: '',
    })

    useEffect(() => {
        dispatch(fetchCart())
        dispatch(fetchAddresses())
    }, [dispatch])

    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddress = addresses.find((address) => address.default === true)
            setOrderData({
                ...orderData,
                shippingAddress: defaultAddress,
            })
        }
    }, [addresses])

    const handleChangeOrderData = (key, value) => {
        setOrderData({
            ...orderData,
            [key]: value,
        })
    }

    const handleSelectItem = (itemId, quantity, price) => {
        setOrderData((prev) => {
            if (prev.products.some((product) => product.product === itemId)) {
                const productsPrice = prev.productsPrice - quantity * price
                return {
                    ...prev,
                    products: prev.products.filter((product) => product.product !== itemId),
                    productsPrice,
                    totalPrice: productsPrice === 0 ? 0 : productsPrice + prev.shippingPrice,
                }
            } else {
                const productsPrice = prev.productsPrice + quantity * price
                return {
                    ...prev,
                    products: [...prev.products, { product: itemId, quantity }],
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
                productsPrice: cart.items.reduce((total, item) => total + item.variant.price * item.quantity, 0),
                totalPrice: cart.items.reduce((total, item) => total + item.variant.price * item.quantity, 0) + prev.shippingPrice,
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
            }
            try {
                await dispatch(createOrderAction(finalOrderData)).unwrap()
                setNotification({
                    show: true,
                    description: 'Đặt hàng thành công',
                    type: 'success',
                    title: 'Thành công',
                })
            } catch (error) {
                setNotification({
                    show: true,
                    description: error.message,
                    type: 'error',
                    title: 'Lỗi',
                })
            }
        }
    }

    const handleQuantityChange = (itemId, change) => {
        const item = cart.items.find((i) => i._id === itemId)
        const newQuantity = Math.max(1, item.quantity + change)
        dispatch(updateItemQuantity({ itemId, quantity: newQuantity }))
    }

    const handleRemoveItem = (itemId) => {
        dispatch(removeItemFromCart(itemId))
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

    return (
        <>
            <div className="container h-100 px-5 py-5">
                {/* Modal Voucher */}
                <Modal show={showVoucher} onHide={handleCloseVoucher} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="fs-2">Chọn voucher giảm giá</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="">
                            <div className="d-flex align-items-center pb-3 border-bottom">
                                <p className="fs-3 ">Mã voucher</p>
                                <div className="input-form d-flex align-items-center mx-3 flex-grow-1">
                                    <input type="text" autoComplete="off" className="input-text w-100" placeholder="Nhập mã" />
                                </div>
                                <div className="primary-btn py-2 px-3 shadow-none">
                                    <p>Áp dụng</p>
                                </div>
                            </div>
                            <p className="fs-3 my-3">Mã của bạn</p>
                            <div className="my-2" style={{ maxHeight: 260, overflowY: 'auto' }}>
                                <div className="d-flex p-3 align-items-center my-2 border rounded-3">
                                    <img src="" alt="" width={60} height={60} />
                                    <div className="mx-3 flex-grow-1">
                                        <p>
                                            Giảm <strong>15%</strong>
                                        </p>
                                        <p>
                                            Giảm tối đa <strong>20k</strong>
                                        </p>
                                        <p>
                                            Đơn tối thiểu <strong>100k</strong>
                                        </p>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p>
                                            Số lượng: <strong>10</strong>
                                        </p>
                                        <p>
                                            HSD: <strong>30/09/2024</strong>
                                        </p>
                                    </div>
                                    <label className="d-flex align-items-center ms-3">
                                        <input type="checkbox" className="input-checkbox" />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                </div>
                                <div className="d-flex p-3 align-items-center my-2 border rounded-3">
                                    <img src="" alt="" width={60} height={60} />
                                    <div className="mx-3 flex-grow-1">
                                        <p>
                                            Giảm <strong>15%</strong>
                                        </p>
                                        <p>
                                            Giảm tối đa <strong>20k</strong>
                                        </p>
                                        <p>
                                            Đơn tối thiểu <strong>100k</strong>
                                        </p>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p>
                                            Số lượng: <strong>10</strong>
                                        </p>
                                        <p>
                                            HSD: <strong>30/09/2024</strong>
                                        </p>
                                    </div>
                                    <label className="d-flex align-items-center ms-3">
                                        <input type="checkbox" className="input-checkbox" />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                </div>
                                <div className="d-flex p-3 align-items-center my-2 border rounded-3">
                                    <img src="" alt="" width={60} height={60} />
                                    <div className="mx-3 flex-grow-1">
                                        <p>
                                            Giảm <strong>15%</strong>
                                        </p>
                                        <p>
                                            Giảm tối đa <strong>20k</strong>
                                        </p>
                                        <p>
                                            Đơn tối thiểu <strong>100k</strong>
                                        </p>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p>
                                            Số lượng: <strong>10</strong>
                                        </p>
                                        <p>
                                            HSD: <strong>30/09/2024</strong>
                                        </p>
                                    </div>
                                    <label className="d-flex align-items-center ms-3">
                                        <input type="checkbox" className="input-checkbox" />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="primary-btn px-4 py-2 shadow-none light border rounded-3" variant="secondary" onClick={handleCloseVoucher}>
                            <p>Đóng</p>
                        </div>
                        <div className="primary-btn px-4 py-2 shadow-none" variant="secondary" onClick={handleCloseVoucher}>
                            <p>Xác nhận</p>
                        </div>
                    </Modal.Footer>
                </Modal>
                <SelectAddressModal
                    showAddress={showAddress}
                    handleCloseAddress={handleCloseAddress}
                    addresses={addresses}
                    originalSelectedAddress={orderData.shippingAddress}
                    handleSelectAddress={(address) => handleChangeOrderData('shippingAddress', address)}
                />
                {/* Modal Payment Method*/}
                <Modal show={showPaymentMethod} onHide={handleClosePaymentMethod} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="fs-2">Chọn phương thức thanh toán</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="">
                            <div className="d-flex p-3 align-items-center border-bottom">
                                <label className="d-flex align-items-center me-3">
                                    <input type="checkbox" className="input-checkbox" />
                                    <span className="custom-checkbox"></span>
                                </label>
                                <p className="fs-3">Thanh toán khi nhận hàng</p>
                            </div>
                            <div className="d-flex p-3 align-items-center border-bottom">
                                <label className="d-flex align-items-center me-3">
                                    <input type="checkbox" className="input-checkbox" />
                                    <span className="custom-checkbox"></span>
                                </label>
                                <p className="fs-3">Thanh toán bằng chuyển khoản</p>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="primary-btn px-4 py-2 shadow-none light border rounded-3" variant="secondary" onClick={handleClosePaymentMethod}>
                            <p>Đóng</p>
                        </div>
                        <div className="primary-btn px-4 py-2 shadow-none" variant="secondary" onClick={handleClosePaymentMethod}>
                            <p>Xác nhận</p>
                        </div>
                    </Modal.Footer>
                </Modal>
                <p className="fw-bold fs-2">Giỏ hàng</p>
                <div className="d-flex">
                    <div className="mt-2 me-4" style={{ width: '70%' }}>
                        {status === 'failed' ? (
                            <p className="text-center fs-3">Lỗi khi lấy giỏ hàng</p>
                        ) : status === 'succeeded' && cart.items.length === 0 ? (
                            <div className="text-center">
                                <p className="fs-3 fw-medium">Giỏ hàng của bạn còn trống</p>
                                <button className="primary-btn px-4 py-2 shadow-none mt-3" onClick={() => navigate('/products')}>
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
                                                <input type="checkbox" className="input-checkbox" onChange={handleSelectAll} checked={orderData.products.length === cart.items.length} />
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
                                            <div key={item._id} className="d-flex py-3 border-bottom align-items-center">
                                                <div className="d-flex align-items-center" style={{ width: '40%' }}>
                                                    <label className="d-flex align-items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="input-checkbox"
                                                            checked={orderData.products.some((product) => product.product === item.variant._id)}
                                                            onChange={() => handleSelectItem(item.variant._id, item.quantity, item.variant.price)}
                                                        />
                                                        <span className="custom-checkbox"></span>
                                                    </label>
                                                    <img className="mx-3" src={item.variant.imageUrl} alt="" width={70} height={70} />
                                                    <div className="flex-grow-1">
                                                        <p className="fs-3 fw-medium product-name" style={{ maxWidth: '80%' }}>
                                                            {item.variant.product.name}
                                                        </p>
                                                        <p className="fw-medium">Size: {item.variant.size}</p>
                                                        <p className="fw-medium">Màu: {item.variant.color}</p>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 m-auto">
                                                    <p className="text-center fs-3">{item.variant.price}đ</p>
                                                </div>
                                                <div className="flex-grow-1 justify-content-center d-flex">
                                                    <div className="d-flex align-items-center justify-content-center px-1 py-1 rounded-4 border border-black my-4">
                                                        <FontAwesomeIcon icon={faMinus} size="lg" className="p-4" onClick={() => handleQuantityChange(item._id, -1)} style={{ cursor: 'pointer' }} />
                                                        <p className="fs-3 fw-medium lh-1 mx-2">{item.quantity}</p>
                                                        <FontAwesomeIcon icon={faPlus} size="lg" className="p-4" onClick={() => handleQuantityChange(item._id, 1)} style={{ cursor: 'pointer' }} />
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 m-auto">
                                                    <p className="text-center fs-3">{item.variant.price * item.quantity}đ</p>
                                                </div>
                                                <FontAwesomeIcon icon={faTrashCan} className="fs-3 p-2 hover-icon" color="#ff7262" onClick={() => handleRemoveItem(item._id)} />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )
                        )}
                    </div>
                    <div className="p-4" style={{ width: '30%' }}>
                        <div className="w-100 h-100 border p-3">
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium ">Tổng tiền hàng:</p>
                                <p className="fs-3 ">{orderData.productsPrice}đ</p>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium ">
                                    <FontAwesomeIcon icon={faTicket} className="fs-2" /> Mã giảm giá
                                </p>
                                <div className="primary-btn px-2 py-1 shadow-none" onClick={handleShowVoucher}>
                                    <p>Chọn</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium ">Phí vận chuyển:</p>
                                <p className="fs-3 ">30.000đ</p>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium text-nowrap">Địa chỉ:</p>
                                <div className="d-flex align-items-center">
                                    <div className="ms-3">
                                        <p className="fs-3">{orderData.shippingAddress.name}</p>
                                        <p className="fs-3">{orderData.shippingAddress.phone}</p>
                                        <p className="fs-3 fw-medium product-name">{orderData.shippingAddress.location}</p>
                                    </div>
                                    <FontAwesomeIcon icon={faPen} color="#4a90e2" className="hover-icon fs-2 ms-2 p-2" onClick={handleShowAddress} />
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium text-wrap" style={{ maxWidth: 120 }}>
                                    Phương thức thanh toán:
                                </p>
                                <div className="d-flex align-items-center flex-grow-1 justify-content-between">
                                    <p className="fs-3">{orderData.paymentMethod === 'paymentUponReceipt' && 'Khi nhận hàng'}</p>
                                    <FontAwesomeIcon icon={faPen} color="#4a90e2" className="hover-icon fs-2 ms-2 p-2" onClick={handleShowPaymentMethod} />
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-bolder ">Tổng tiền:</p>
                                <p className="fs-3 fw-bolder">{orderData.totalPrice}đ</p>
                            </div>
                            <div className="text-center py-3">
                                <button disabled={orderData.products.length === 0} className="primary-btn shadow-none px-5 py-3" onClick={handleOrder}>
                                    <p>Đặt hàng</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {notification.show && (
                <Modal show={notification.show} onHide={() => setNotification({ ...notification, show: false })} centered>
                    <Notification title={notification.title} description={notification.description} type={notification.type} />
                </Modal>
            )}
        </>
    )
}

export default Cart
