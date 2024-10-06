import './Cart.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPen, faPlus, faTicket } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from 'react'
import { fetchCart, updateItemQuantity, removeItemFromCart } from '../../redux/slices/cartSlice'
import { useSelector, useDispatch } from 'react-redux'

function Cart() {
    const dispatch = useDispatch()
    const { cart, loading } = useSelector((state) => state.cart)
    // state
    const [selectedItems, setSelectedItems] = useState([])
    const [showVoucher, setShowVoucher] = useState(false)
    const [showAddress, setShowAddress] = useState(false)
    const [showPaymentMethod, setShowPaymentMethod] = useState(false)

    useEffect(() => {
        dispatch(fetchCart())
    }, [dispatch])

    const handleSelectItem = (itemId) => {
        setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
    }

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(cart.items.map((item) => item._id))
        } else {
            setSelectedItems([])
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

    const calculateTotal = () => {
        return selectedItems.reduce((total, itemId) => {
            const item = cart.items.find((i) => i._id === itemId)
            return total + item.variant.price * item.quantity
        }, 0)
    }

    const handleCloseVoucher = () => setShowVoucher(false)
    const handleShowVoucher = () => setShowVoucher(true)
    const handleCloseAddress = () => setShowAddress(false)
    const handleShowAddress = () => setShowAddress(true)
    const handleClosePaymentMethod = () => setShowPaymentMethod(false)
    const handleShowPaymentMethod = () => setShowPaymentMethod(true)

    if (!cart) {
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
                {/* Modal Address */}
                <Modal show={showAddress} onHide={handleCloseAddress} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="fs-2">Địa chỉ của bạn</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="">
                            <div className="px-3" style={{ maxHeight: 350, overflowY: 'auto' }}>
                                <div className="d-flex py-3 border-bottom">
                                    <label className="d-flex align-items-center">
                                        <input type="checkbox" className="input-checkbox" />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                    <div className="mx-3 flex-grow-1">
                                        <p className="fs-4 fw-medium">Đinh Như Thông</p>
                                        <p className="fs-4 fw-medium">(+84) 866 234 131</p>
                                        <p className="fs-4 product-name ">
                                            Bcons Sala Dĩ An, Thành phố Dĩ An, Bình Dương ấ ầ ấ fasf á fsa f à á fas fa fasf á fa sf a asdasdasd á da sd á a s á d asd á d á á d a{' '}
                                        </p>
                                    </div>
                                    <div className="m-auto flex-grow-1">
                                        <FontAwesomeIcon icon={faPen} className="py-4 fs-3 " />
                                        <div className="p-2 border ">
                                            <p className="fs-3 text-nowrap text-body-tertiary">Mặc định</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex py-3 border-bottom">
                                    <label className="d-flex align-items-center">
                                        <input type="checkbox" className="input-checkbox" />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                    <div className="mx-3 flex-grow-1">
                                        <p className="fs-4 fw-medium">Đinh Như Thông</p>
                                        <p className="fs-4 fw-medium">(+84) 866 234 131</p>
                                        <p className="fs-4 product-name ">
                                            Bcons Sala Dĩ An, Thành phố Dĩ An, Bình Dương ấ ầ ấ fasf á fsa f à á fas fa fasf á fa sf a asdasdasd á da sd á a s á d asd á d á á d a{' '}
                                        </p>
                                    </div>
                                    <div className="m-auto ">
                                        <FontAwesomeIcon icon={faPen} className="py-4 fs-3" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 ">
                                <div className="p-2 border d-inline-flex align-items-center">
                                    <FontAwesomeIcon icon={faPlus} className="mx-3 fs-3 text-body-tertiary" />
                                    <p className="text-body-tertiary fs-3">Thêm địa chỉ mới</p>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="primary-btn px-4 py-2 shadow-none light border rounded-3" variant="secondary" onClick={handleCloseAddress}>
                            <p>Đóng</p>
                        </div>
                        <div className="primary-btn px-4 py-2 shadow-none" variant="secondary" onClick={handleCloseAddress}>
                            <p>Xác nhận</p>
                        </div>
                    </Modal.Footer>
                </Modal>
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
                        {cart.items.length === 0 || !cart ? (
                            <div className="text-center">
                                <p className="fs-3 fw-medium">Giỏ hàng của bạn còn trống</p>
                                <div className="primary-btn px-4 py-2 shadow-none mt-3">
                                    <p>Mua ngay</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="d-flex pb-3 border-bottom">
                                    <div className="d-flex" style={{ width: '40%' }}>
                                        <label className="d-flex align-items-center">
                                            <input type="checkbox" className="input-checkbox" onChange={handleSelectAll} checked={selectedItems.length === cart.items.length} />
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
                                                    <input type="checkbox" className="input-checkbox" checked={selectedItems.includes(item._id)} onChange={() => handleSelectItem(item._id)} />
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
                        )}
                    </div>
                    <div className="p-4" style={{ width: '30%' }}>
                        <div className="w-100 h-100 border p-3">
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium ">Tổng tiền hàng:</p>
                                <p className="fs-3 ">{calculateTotal()}đ</p>
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
                                        <p className="fs-3">Trần Trung Thông</p>
                                        <p className="fs-3">0861082130</p>
                                        <p className="fs-3 product-name">Bcon Sala, Dĩ An, Bình Dương,asdasdas,ádas asda ấ sasd a á</p>
                                    </div>
                                    <FontAwesomeIcon icon={faPen} className="fs-2 ms-2 py-4" onClick={handleShowAddress} />
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-medium text-wrap" style={{ maxWidth: 120 }}>
                                    Phương thức thanh toán:
                                </p>
                                <div className="d-flex align-items-center flex-grow-1 justify-content-between">
                                    <p className="fs-3">Khi nhận hàng</p>
                                    <FontAwesomeIcon icon={faPen} className="fs-2 ms-2 py-4" onClick={handleShowPaymentMethod} />
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-3 border-bottom align-items-center">
                                <p className="fs-3 fw-bolder ">Tổng tiền:</p>
                                <p className="fs-3 fw-bolder">200.000đ</p>
                            </div>
                            <div className="text-center py-3">
                                <div className="primary-btn shadow-none px-5 py-3">
                                    <p>Đặt hàng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart
