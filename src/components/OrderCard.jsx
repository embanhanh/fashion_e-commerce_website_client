import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { cancelOrderUser, fetchOrderUser, returnOrderUser } from '../redux/slices/userSlice'
import { addItemToCart } from '../redux/slices/cartSlice'
import RatingDemo from './RatingDemo'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase.config'
import { doc, getDoc } from 'firebase/firestore'
import { storage } from '../firebase.config'
import { v4 as uuidv4 } from 'uuid'

import './OrderCard.scss'

function OrderCard({ order }) {
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const { loading: cartLoading } = useSelector((state) => state.cart)
    const { error } = useSelector((state) => state.user)
    const { user } = useSelector((state) => state.auth)
    const { isLoggedIn } = useSelector((state) => state.auth)

    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false)
    const [cancelReason, setCancelReason] = useState('')
    const [returnReason, setReturnReason] = useState('')
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [showReturnOrderModal, setShowReturnOrderModal] = useState(false)
    const [files, setFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [isRating, setIsRating] = useState(false)

    const handleDetailOrder = (order_id) => {
        navigate(`/user/account/orders/${order._id}`)
    }

    const handleProductDetail = (productId) => {
        navigate(`/products/${productId}`)
    }

    const handleCancelOrder = (orderId) => {
        setShowCancelOrderModal(true)
    }

    const handleReviewOrder = () => {
        setShowRatingModal(true)
    }

    const handleConfirmCancelOrder = async () => {
        try {
            if (!cancelReason) {
                Swal.fire({
                    title: 'Thất bại',
                    text: 'Bạn chưa chọn lý do hủy đơn hàng',
                    icon: 'warning',
                })
                return
            }

            const result = await Swal.fire({
                title: 'Xác nhận',
                text: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Đóng',
                confirmButtonText: 'Hủy đơn hàng',
            })

            if (result.isConfirmed) {
                await dispatch(cancelOrderUser({ orderId: order._id, reason: cancelReason })).unwrap()

                dispatch(fetchOrderUser())

                Swal.fire({
                    title: 'Thành công',
                    text: 'Đơn hàng đã được hủy thành công',
                    icon: 'success',
                })
                setShowCancelOrderModal(false)
                setCancelReason('')
            }
        } catch (error) {
            Swal.fire({
                title: 'Thất bại',
                text: error.response.data.message,
                icon: 'error',
            })
        }
    }

    const handleBuyAgain = async (order) => {
        if (!isLoggedIn) {
            navigate('/user/login', { state: { from: location.pathname } })
            return
        }

        try {
            for (const product of order.products) {
                await dispatch(
                    addItemToCart({
                        variant: product.product._id,
                        quantity: product.quantity,
                    })
                ).unwrap()
            }

            Swal.fire({
                title: 'Thành công',
                text: 'Đã thêm sản phẩm vào giỏ hàng thành công!',
                icon: 'success',
                confirmButtonText: 'OK',
            })
        } catch (error) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Có lỗi xảy ra ' + error,
                icon: 'error',
                confirmButtonText: 'OK',
            })
        }
    }

    const handleReturnOrder = () => {
        setShowReturnOrderModal(true)
    }

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files)
        if (files.length + selectedFiles.length > 3) {
            Swal.fire({
                title: 'Thất bại',
                text: 'Chỉ được tải lên tối đa 3 files',
                icon: 'warning',
            })
        } else {
            const newFiles = selectedFiles.filter(
                (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
            )
            setFiles((prevFiles) => [...prevFiles, ...newFiles])
            newFiles.forEach((file) => {
                const preview = {
                    url: URL.createObjectURL(file),
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                    file: file,
                }
                setPreviews((prev) => [...prev, preview])
            })
        }
    }

    const removeFile = (index) => {
        URL.revokeObjectURL(previews[index].url)
        const newFiles = files.filter((_, i) => i !== index)
        const newPreviews = previews.filter((_, i) => i !== index)
        setFiles(newFiles)
        setPreviews(newPreviews)
    }

    useEffect(() => {
        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url))
        }
    }, [])

    const isWithin7Days = (deliveredDate) => {
        const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000 // 7 ngày tính bằng milliseconds
        const deliveredTime = new Date(deliveredDate).getTime()
        const currentTime = new Date().getTime()

        return currentTime - deliveredTime <= SEVEN_DAYS_IN_MS
    }

    // const uploadFilesToFirebase = async (files) => {
    //     const uploadPromises = files.map(async (preview) => {
    //         // Tạo reference với path cụ thể
    //         const fileRef = ref(storage, `returns/${order._id}/${uuidv4()}`)

    //         // Convert URL thành blob
    //         const response = await fetch(preview.url)
    //         const blob = await response.blob()

    //         // Upload file lên Firebase Storage
    //         await uploadBytes(fileRef, blob)

    //         // Lấy URL public để truy cập file
    //         const downloadURL = await getDownloadURL(fileRef)

    //         // Trả về URL string thay vì object
    //         return downloadURL
    //     })

    //     return Promise.all(uploadPromises)
    // }

    const handleConfirmReturn = async (orderId) => {
        try {
            if (!returnReason) {
                Swal.fire({
                    title: 'Thất bại',
                    text: 'Vui lòng chọn lý do trả hàng',
                    icon: 'warning',
                })
                return
            }
            if (files.length === 0) {
                Swal.fire({
                    title: 'Thất bại',
                    text: 'Vui lòng thêm ít nhất 1 hình ảnh/video minh chứng',
                    icon: 'warning',
                })
                return
            }

            const result = await Swal.fire({
                title: 'Xác nhận',
                text: 'Bạn có chắc chắn muốn yêu cầu trả hàng không?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Hủy',
                confirmButtonText: 'Xác nhận',
            })

            if (result.isConfirmed) {
                let evidenceUrls = []
                for (const preview of previews) {
                    if (preview.url && !preview.url.startsWith('https://firebasestorage.googleapis.com')) {
                        const uploadedUrl = await uploadImage(preview.url)
                        evidenceUrls.push(uploadedUrl)
                    } else {
                        evidenceUrls.push(preview.url)
                    }
                }

                const returnData = {
                    reason: returnReason,
                    evidence: evidenceUrls,
                }

                await dispatch(
                    returnOrderUser({
                        orderId: orderId,
                        returnData: returnData,
                    })
                ).unwrap()

                Swal.fire({
                    title: 'Thành công',
                    text: 'Yêu cầu trả hàng đã được gửi',
                    icon: 'success',
                })
                setShowReturnOrderModal(false)
                setReturnReason('')
                setFiles([])
                setPreviews([])
            }
        } catch (error) {
            Swal.fire({
                title: 'Thất bại',
                text: error.message,
                icon: 'error',
            })
        }
    }

    // Hàm upload image giống như upload avatar
    const uploadImage = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            const fileRef = ref(storage, `returns/${order._id}/${uuidv4()}`)
            await uploadBytes(fileRef, blob)
            const downloadURL = await getDownloadURL(fileRef)
            return downloadURL
        } catch (error) {
            throw new Error('Lỗi khi upload ảnh: ' + error.message)
        }
    }

    const checkUserRating = async (productId, userId) => {
        let isRating = false
        const ratingDoc = doc(db, 'product_ratings', productId)
        const ratingSnapshot = await getDoc(ratingDoc)
        if (ratingSnapshot.exists()) {
            const ratings = ratingSnapshot.data().ratings
            isRating = ratings.some((rating) => rating.user._id === userId)
        }
        setIsRating(isRating)
    }

    useEffect(() => {
        checkUserRating(order.products[0].product.product._id, user._id)
    }, [order, user])

    return (
        <div className="d-flex flex-column justify-content-between bg-white my-5">
            <div className="d-flex justify-content-between my-4">
                <p className="fs-4 fw-normal ms-3">
                    Mã đơn hàng: <span className="fs-3">{order._id}</span>
                </p>
                <p className="text-uppercase me-3 fs-4">
                    {order.status === 'processing' ? (
                        <span className="text-warning">Đang xử lý</span>
                    ) : order.status === 'pending' ? (
                        <span className="text-pending">Chờ xác nhận</span>
                    ) : order.status === 'delivering' ? (
                        <span className="text-delivering">Đang giao hàng</span>
                    ) : order.status === 'delivered' ? (
                        <span className="text-delivered">Đã giao</span>
                    ) : order.status === 'cancelled' ? (
                        <span className="text-cancelled">Đã hủy</span>
                    ) : order.status === 'returned' ? (
                        <span className="text-cancelled">Yêu cầu trả hàng</span>
                    ) : null}{' '}
                </p>
            </div>
            <div className="d-flex flex-column border-top">
                {order?.products.map((product, index) => (
                    <div key={index} className="d-flex justify-content-between border-bottom p-4">
                        <div className="d-flex">
                            <img src={product.product.imageUrl} alt="error" style={{ width: '50px', height: '50px' }} />
                            <div className="d-flex flex-column ms-4">
                                <p className="fs-4 text-wrap" onClick={() => handleProductDetail(product.product._id)}>
                                    Tên sản phẩm: {product.product.product.name}
                                </p>
                                <p>Số lượng: {product.quantity}</p>
                                <div className="d-flex">
                                    <p>Phân loại hàng: </p>
                                    {product.product.product.categories.map((categorie, index) => (
                                        <p key={index} className="ms-2">
                                            {categorie.name}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <span className="fs-5 text-decoration-line-through text-secondary mx-2">
                                {product.product.product.originalPrice.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="fs-4 text-body">{product.product.price.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className=" p-5 d-flex flex-row-reverse">
                <p className="fs-3 fw-normal text-center p-1 ms-3 d-flex align-items-center">
                    {order.totalPrice.toLocaleString('vi-VN')}đ
                </p>
                <p className="fs-4 fw-normal d-flex align-items-center">Thành tiền:</p>
            </div>

            <div className="order-actions p-4 border-top">
                <div className="d-flex justify-content-end gap-3">
                    {(order.status === 'pending' || order.status === 'processing') && (
                        <>
                            <button className="btn-detail-order" onClick={() => handleDetailOrder(order._id)}>
                                Xem chi tiết đơn hàng
                            </button>
                            <button className="btn-cancel-order" onClick={() => handleCancelOrder(order._id)}>
                                Hủy đơn hàng
                            </button>
                        </>
                    )}
                    {order.status === 'delivering' && (
                        <>
                            <button className="btn-detail-order" onClick={handleDetailOrder}>
                                Xem chi tiết đơn hàng
                            </button>
                            <button className="btn-preview-order" disabled={true}>
                                Đánh giá
                            </button>
                        </>
                    )}

                    {order.status === 'delivered' && (
                        <>
                            <button className="btn-detail-order" onClick={handleDetailOrder}>
                                Xem chi tiết đơn hàng
                            </button>

                            <button className="btn-preview-order" onClick={handleReviewOrder} disabled={isRating}>
                                Đánh giá
                            </button>

                            {isWithin7Days(order.deliveredAt) && (
                                <button className="btn-return-order" onClick={() => handleReturnOrder(order._id)}>
                                    Yêu cầu trả hàng
                                </button>
                            )}
                        </>
                    )}
                    {order.status === 'cancelled' && (
                        <>
                            <button className="btn-detail-order" onClick={() => handleDetailOrder(order._id)}>
                                Xem chi tiết đơn hủy
                            </button>
                            <button
                                className="btn-buy-again-order"
                                onClick={() => handleBuyAgain(order)}
                                disabled={cartLoading}
                            >
                                {cartLoading ? 'Đang xử lý...' : 'Mua lại'}
                            </button>
                        </>
                    )}
                    {order.status === 'returned' && (
                        <button className="btn-detail-order" onClick={() => handleDetailOrder(order._id)}>
                            Xem chi tiết đơn hàng
                        </button>
                    )}
                </div>
            </div>
            {showCancelOrderModal && (
                <Modal
                    show={showCancelOrderModal}
                    onHide={() => setShowCancelOrderModal(false)}
                    centered
                    restoreFocus={true}
                    autoFocus={true}
                >
                    <Modal.Header closeButton>
                        <Modal.Title className="fs-2">Hủy đơn hàng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="fs-3">Lý do hủy đơn hàng:</p>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="changeAddress"
                                    value="change_address"
                                    checked={cancelReason === 'change_address'}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Muốn thay đổi địa chỉ giao hàng.</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="changeVoucher"
                                    value="change_voucher"
                                    checked={cancelReason === 'change_voucher'}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Muốn nhập/thay đổi voucher.</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="changeProduct"
                                    value="change_product"
                                    checked={cancelReason === 'change_product'}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">
                                    Muốn thay đổi sản phẩm(số lượng, màu sắc, phân loại hàng,...).
                                </span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="findCheaper"
                                    value="find_cheaper"
                                    checked={cancelReason === 'find_cheaper'}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Tìm thấy giá rẻ ở chỗ khác.</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="cancelPurchase"
                                    value="cancel_purchase"
                                    checked={cancelReason === 'cancel_purchase'}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Đổi ý, không muốn mua nữa.</span>
                            </label>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn-cancel-order" onClick={() => setShowCancelOrderModal(false)}>
                            Hủy
                        </button>
                        <button className="btn-confirm-cancel" onClick={handleConfirmCancelOrder}>
                            Xác nhận
                        </button>
                    </Modal.Footer>
                </Modal>
            )}
            {showReturnOrderModal && (
                <Modal
                    show={showReturnOrderModal}
                    onHide={() => {
                        setShowReturnOrderModal(false)
                        setFiles([])
                        setPreviews([])
                        setReturnReason('')
                    }}
                    centered
                    restoreFocus={true}
                    autoFocus={true}
                >
                    <Modal.Header closeButton>
                        <Modal.Title className="fs-2">Yêu cầu trả hàng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="fs-3">Lý do trả hàng:</p>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="product_defective"
                                    value="product_defective"
                                    checked={returnReason === 'product_defective'}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Hàng lỗi.</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="product_not_match_description"
                                    value="product_not_match_description"
                                    checked={returnReason === 'product_not_match_description'}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Sản phẩm không khớp với mô tả.</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="product_not_match"
                                    value="product_not_match"
                                    checked={returnReason === 'product_not_match'}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Hàng không đúng màu, kích cỡ, phân loại hàng.</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="product_used"
                                    value="product_used"
                                    checked={returnReason === 'product_used'}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Hàng đã qua sử dụng.</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="product_fake"
                                    value="product_fake"
                                    checked={returnReason === 'product_fake'}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Hàng giả, nhái.</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="product_not_use"
                                    value="product_not_use"
                                    checked={returnReason === 'product_not_use'}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2 text-wrap">
                                    Hàng nguyên vẹn nhưng không còn nhu cầu sử dụng.
                                </span>
                            </label>
                        </div>
                        <div>
                            <p className="fs-3">Minh chứng:</p>
                            <div className="d-flex gap-3">
                                {previews.map((preview, index) => (
                                    <div
                                        key={index}
                                        className="position-relative rating-preview__container"
                                        style={{ width: '100px', height: '100px' }}
                                    >
                                        {preview.type === 'image' ? (
                                            <img
                                                src={preview.url}
                                                alt={`preview-${index}`}
                                                className="w-100 h-100 object-fit-cover rounded-4"
                                            />
                                        ) : (
                                            <video
                                                src={preview.url}
                                                className="w-100 h-100 object-fit-cover rounded-4"
                                                controls={false}
                                                onClick={(e) => {
                                                    if (e.target.paused) {
                                                        e.target.play()
                                                    } else {
                                                        e.target.pause()
                                                    }
                                                }}
                                            />
                                        )}
                                        <button
                                            className="position-absolute rating-preview__btn-close top-0 end-0 border-0"
                                            onClick={() => removeFile(index)}
                                        >
                                            <FontAwesomeIcon icon={faXmark} size="lg" />
                                        </button>
                                    </div>
                                ))}
                                {files.length < 3 && (
                                    <label className="custum-file-upload px-1">
                                        <div className="icon-image">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill=""
                                                viewBox="0 0 24 24"
                                                className="upload-icon"
                                            >
                                                <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                                                <g
                                                    strokeLinejoin="round"
                                                    strokeLinecap="round"
                                                    id="SVGRepo_tracerCarrier"
                                                />
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        fill=""
                                                        d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                                                        clipRule="evenodd"
                                                        fillRule="evenodd"
                                                    />
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="text w-100">
                                            <span>Thêm hình ảnh/ video</span>
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            id="main-product-images"
                                            onChange={handleFileChange}
                                            accept="image/*, video/*"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn-cancel-order" onClick={() => setShowReturnOrderModal(false)}>
                            Hủy
                        </button>
                        <button className="btn-confirm-cancel" onClick={() => handleConfirmReturn(order._id)}>
                            Xác nhận
                        </button>
                    </Modal.Footer>
                </Modal>
            )}
            {showRatingModal && (
                <RatingDemo
                    productId={order.products[0].product.product._id}
                    onClose={() => setShowRatingModal(false)}
                    onRatingSuccess={() => {
                        dispatch(fetchOrderUser())
                        setShowRatingModal(false)
                    }}
                />
            )}
        </div>
    )
}

export default OrderCard
