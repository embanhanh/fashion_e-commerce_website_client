import React, { useState, useEffect, useCallback } from 'react'
import DatePicker from 'react-datepicker'
import './OrderManagement.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import {
    getAdminOrdersAction,
    setFilters,
    updateOrderStatusManyAction,
    getOrderByIdAction,
} from '../../redux/slices/orderSilce'
import ChangeStatusModal from '../../components/ChangeStatusModal'
import Modal from 'react-bootstrap/Modal'
import debounce from 'lodash/debounce'
import defaultAvatar from '../../assets/image/default/default-avatar.png'
import DetailModal from '../../components/DetailModal'
import ReturnModal from '../../components/ReturnModal'

const OrderManagement = () => {
    const dispatch = useDispatch()
    const { orders, status, error, filters, currentOrder } = useSelector((state) => state.order)
    // modal
    const [showChangeStatusModal, setShowChangeStatusModal] = useState({
        show: false,
        originalStatus: '',
        orderId: '',
    })
    const [showNotifyModal, setShowNotifyModal] = useState({
        show: false,
        description: '',
        title: '',
        type: '',
    })
    const [showDetailOrder, setShowDetailOrder] = useState({
        show: false,
        orderId: '',
    })

    const [showReturnModal, setShowReturnModal] = useState({
        show: false,
        orderId: '',
    })
    // state
    const [filterStatus, setFilterStatus] = useState('')
    const [filterLocal, setFilterLocal] = useState({
        productName: '',
        orderStartDate: null,
        orderEndDate: null,
        paymentMethod: '',
        shippingMethod: '',
    })
    const [selectedOrderIds, setSelectedOrderIds] = useState([])
    const [bulkAction, setBulkAction] = useState('')
    const [orderId, setOrderId] = useState(null)
    const [reasonStatus, setReasonStatus] = useState('')

    const debouncedFetchOrders = useCallback(
        debounce(() => {
            dispatch(getAdminOrdersAction(filters))
        }, 300),
        [dispatch, filters]
    )

    useEffect(() => {
        debouncedFetchOrders()
    }, [debouncedFetchOrders])

    const handleChangeFilter = (name, value) => {
        setFilterLocal({ ...filterLocal, [name]: value })
    }

    const handleSubmitFilters = () => {
        dispatch(setFilters({ ...filterLocal, status: filterStatus }))
    }

    const handleSelectOrder = (orderId) => {
        if (selectedOrderIds.includes(orderId)) {
            setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId))
        } else {
            setSelectedOrderIds((prev) => [...prev, orderId])
        }
    }

    const handleSelectAllOrders = () => {
        if (selectedOrderIds.length === orders.length) {
            setSelectedOrderIds([])
        } else {
            setSelectedOrderIds(orders.map((order) => order._id))
        }
    }

    const handleStatusChange = async () => {
        try {
            await dispatch(updateOrderStatusManyAction({ orderIds: selectedOrderIds, status: bulkAction })).unwrap()
            // setShowNotifyModal({
            //     show: true,
            //     description: 'Cập nhật trạng thái đơn hàng thành công',
            //     title: 'Thành công',
            //     type: 'success',
            // })
            Swal.fire({
                title: 'Thành công',
                text: 'Cập nhật trạng thái đơn hàng thành công',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                dispatch(getAdminOrdersAction(filters))
            })
            setSelectedOrderIds([])
        } catch (error) {
            // setShowNotifyModal({ show: true, description: error.message, title: 'Thất bại', type: 'error' })
            Swal.fire({
                title: 'Thất bại',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK',
            })
        } finally {
            setBulkAction('')
        }
    }

    // useEffect(() => {
    //     if (orders) {
    //         console.log(orders.filter((order) => order.status === 'cancelled'))
    //     }
    // }, [orders])

    const handlePrintInvoice = (order) => {
        localStorage.setItem('selectedOrders', JSON.stringify([order]))
        window.open(`/invoice`, '_blank', 'noopener,noreferrer')
    }

    const handlePrintInvoiceMany = () => {
        if (selectedOrderIds.length > 0) {
            const selectedOrders = orders.filter((order) => selectedOrderIds.includes(order._id))
            if (selectedOrders.length > 0) {
                localStorage.setItem('selectedOrders', JSON.stringify(selectedOrders))
                window.open('/invoice', '_blank', 'noopener,noreferrer')
            }
        }
    }

    const handleShowDetail = (order_id) => {
        setOrderId(order_id)
        setShowDetailOrder(true)
    }

    useEffect(() => {
        if (orderId) {
            dispatch(getOrderByIdAction(orderId))
        }
    }, [orderId])

    useEffect(() => {
        if (currentOrder) {
            setReasonStatus(currentOrder?.statusReason)
        }
    }, [currentOrder])

    const handleShowReturnModal = () => {
        setShowReturnModal(true)
    }

    const handleCloseOrder = () => {
        setShowDetailOrder(false)
    }

    useEffect(() => {
        handleSubmitFilters()
    }, [filterStatus])

    useEffect(() => {
        if (bulkAction && selectedOrderIds.length > 0) {
            handleStatusChange()
        }
    }, [bulkAction])

    useEffect(() => {
        if (orders) {
            // console.log(orders)
        }
    }, [orders])

    return (
        <div className="pb-5 d-flex flex-column gap-4 px-4">
            <div className="bg-white rounded-4 shadow-sm">
                <p className="fs-3 fw-medium p-3 border-bottom">Quản lý đơn hàng</p>
                <div className="row p-3 g-4 mx-2">
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium text-nowrap me-4 label-width ">Tên sản phẩm</p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input
                                type="text"
                                className="input-text w-100"
                                placeholder="Tên sản phẩm"
                                value={filterLocal.productName}
                                onChange={(e) => handleChangeFilter('productName', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium text-nowrap me-4 label-width ">Ngày đặt hàng</p>
                        <DatePicker
                            selected={filterLocal.orderStartDate}
                            onChange={(date) => handleChangeFilter('orderStartDate', date)}
                            selectsStart
                            startDate={filterLocal.orderStartDate}
                            endDate={filterLocal.orderEndDate}
                            className="input-form fs-4 ps-3"
                            placeholderText="Chọn ngày bắt đầu"
                        />
                        <span className="mx-3 fs-2">-</span>
                        <DatePicker
                            selected={filterLocal.orderEndDate}
                            onChange={(date) => handleChangeFilter('orderEndDate', date)}
                            selectsEnd
                            startDate={filterLocal.orderStartDate}
                            endDate={filterLocal.orderEndDate}
                            minDate={filterLocal.orderStartDate}
                            className="input-form fs-4 ps-3"
                            placeholderText="Chọn ngày kết thúc"
                        />
                    </div>
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium text-nowrap me-4 label-width ">Hình thức vận chuyển</p>
                        <div className="d-flex align-items-center">
                            <div className="select">
                                <div
                                    className="selected"
                                    data-default="Tất cả"
                                    data-one="Cơ bản"
                                    data-two="Nhanh"
                                    data-three="Hỏa tốc"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 512 512"
                                        className="arrow"
                                    >
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="all">
                                        <input
                                            id="all-v2"
                                            name="option-v2"
                                            type="radio"
                                            checked={filterLocal.shippingMethod === 'all'}
                                            value="all"
                                            onChange={(e) => handleChangeFilter('shippingMethod', e.target.value)}
                                        />
                                        <label className="option" htmlFor="all-v2" data-txt="Tất cả" />
                                    </div>
                                    <div title="option-1">
                                        <input
                                            id="option-1-v2"
                                            name="option-v2"
                                            type="radio"
                                            checked={filterLocal.shippingMethod === 'basic'}
                                            value="basic"
                                            onChange={(e) => handleChangeFilter('shippingMethod', e.target.value)}
                                        />
                                        <label className="option" htmlFor="option-1-v2" data-txt="Cơ bản" />
                                    </div>
                                    <div title="option-2">
                                        <input
                                            id="option-2-v2"
                                            name="option-v2"
                                            type="radio"
                                            checked={filterLocal.shippingMethod === 'fast'}
                                            value="fast"
                                            onChange={(e) => handleChangeFilter('shippingMethod', e.target.value)}
                                        />
                                        <label className="option" htmlFor="option-2-v2" data-txt="Nhanh" />
                                    </div>
                                    <div title="option-3">
                                        <input
                                            id="option-3-v2"
                                            name="option-v2"
                                            type="radio"
                                            checked={filterLocal.shippingMethod === 'express'}
                                            value="express"
                                            onChange={(e) => handleChangeFilter('shippingMethod', e.target.value)}
                                        />
                                        <label className="option" htmlFor="option-3-v2" data-txt="Hỏa tốc" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium text-nowrap me-4 label-width ">Hình thức thanh toán</p>
                        <div className="d-flex align-items-center">
                            <div className="select ">
                                <div
                                    className="selected"
                                    data-default="Tất cả"
                                    data-one="Thanh toán khi nhận hàng"
                                    data-two="Thanh toán chuyển khoản"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 512 512"
                                        className="arrow"
                                    >
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="all">
                                        <input
                                            id="all-v3"
                                            name="option-v3"
                                            type="radio"
                                            checked={filterLocal.paymentMethod === ''}
                                            value=""
                                            onChange={(e) => handleChangeFilter('paymentMethod', e.target.value)}
                                        />
                                        <label className="option" htmlFor="all-v3" data-txt="Tất cả" />
                                    </div>
                                    <div title="option-1">
                                        <input
                                            id="option-1-v3"
                                            name="option-v3"
                                            type="radio"
                                            checked={filterLocal.paymentMethod === 'paymentUponReceipt'}
                                            value="paymentUponReceipt"
                                            onChange={(e) => handleChangeFilter('paymentMethod', e.target.value)}
                                        />
                                        <label
                                            className="option"
                                            htmlFor="option-1-v3"
                                            data-txt="Thanh toán khi nhận hàng"
                                        />
                                    </div>
                                    <div title="option-2">
                                        <input
                                            id="option-2-v3"
                                            name="option-v3"
                                            type="radio"
                                            checked={filterLocal.paymentMethod === 'bankTransfer'}
                                            value="bankTransfer"
                                            onChange={(e) => handleChangeFilter('paymentMethod', e.target.value)}
                                        />
                                        <label
                                            className="option"
                                            htmlFor="option-2-v3"
                                            data-txt="Thanh toán chuyển khoản"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex p-3 justify-content-center border-top align-items-center mt-3">
                    <button
                        className="primary-btn shadow-none py-1 px-4 rounded-2 border-1"
                        onClick={handleSubmitFilters}
                    >
                        <p className="fs-4 fw-medium">Tìm</p>
                    </button>

                    <button
                        className="ms-3 py-1 px-4 rounded-2 border bg-white"
                        onClick={() => {
                            const originalFilter = {
                                productName: '',
                                orderStartDate: null,
                                orderEndDate: null,
                                paymentMethod: 'paymentUponReceipt',
                                shippingMethod: 'all',
                            }
                            setFilterLocal(originalFilter)
                            dispatch(setFilters({ ...originalFilter, filterStatus }))
                        }}
                    >
                        <p className="fs-4 fw-medium">Nhập lại</p>
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-4 shadow-sm">
                <div className="nav-wrapper border-bottom d-flex">
                    <div
                        className={`fs-4 py-3 px-4 nav-option ${filterStatus === '' ? 'checked' : ''}`}
                        onClick={() => setFilterStatus('')}
                    >
                        <p className="nav-title fs-4">Tất cả</p>
                    </div>
                    <div
                        className={`fs-4 py-3 px-4 nav-option ${filterStatus === 'pending' ? 'checked' : ''}`}
                        onClick={() => setFilterStatus('pending')}
                    >
                        <p className="nav-title fs-4">Chờ xác nhận</p>
                    </div>
                    <div
                        className={`fs-4 py-3 px-4 nav-option ${filterStatus === 'processing' ? 'checked' : ''}`}
                        onClick={() => setFilterStatus('processing')}
                    >
                        <p className="nav-title fs-4">Đang xử lý</p>
                    </div>
                    <div
                        className={`fs-4 py-3 px-4 nav-option ${filterStatus === 'delivering' ? 'checked' : ''}`}
                        onClick={() => setFilterStatus('delivering')}
                    >
                        <p className="nav-title fs-4">Đang giao</p>
                    </div>
                    <div
                        className={`fs-4 py-3 px-4 nav-option ${filterStatus === 'delivered' ? 'checked' : ''}`}
                        onClick={() => setFilterStatus('delivered')}
                    >
                        <p className="nav-title fs-4">Đã giao</p>
                    </div>
                    <div
                        className={`fs-4 py-3 px-4 nav-option ${filterStatus === 'cancelled' ? 'checked' : ''}`}
                        onClick={() => setFilterStatus('cancelled')}
                    >
                        <p className="nav-title fs-4">Đã hủy</p>
                    </div>
                    <div
                        className={`fs-4 py-3 px-4 nav-option ${filterStatus === 'returned' ? 'checked' : ''}`}
                        onClick={() => setFilterStatus('returned')}
                    >
                        <p className="nav-title fs-4">Yêu cầu trả hàng</p>
                    </div>
                </div>
                <div className="p-3 d-flex align-items-center justify-content-between">
                    <p className="fs-3 fw-medium">{orders.length} đơn hàng</p>
                    <div className="d-flex">
                        <div className="select ">
                            <div
                                className="selected"
                                data-default="Công cụ xử lý hàng loạt"
                                data-one="Xác nhận các đơn hàng đang chọn"
                                data-two="Xác nhận giao hàng các đơn đang chọn"
                                data-three="Xác nhận đã giao các đơn đang chọn"
                                data-four="In hóa đơn các đơn hàng đang chọn"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="1em"
                                    viewBox="0 0 512 512"
                                    className="arrow"
                                >
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            </div>
                            <div className="options">
                                <div title="all">
                                    <input
                                        id="all"
                                        name="option"
                                        type="radio"
                                        value=""
                                        checked={bulkAction === ''}
                                        onChange={() => setBulkAction('')}
                                    />
                                    <label className="option" htmlFor="all" data-txt="Công cụ xử lý hàng loạt" />
                                </div>
                                <div title="option-1">
                                    <input
                                        id="option-1"
                                        name="option"
                                        type="radio"
                                        value="processing"
                                        checked={bulkAction === 'processing'}
                                        onChange={() => {
                                            if (selectedOrderIds.length > 0) {
                                                setBulkAction('processing')
                                            }
                                        }}
                                    />
                                    <label
                                        className="option"
                                        htmlFor="option-1"
                                        data-txt="Xác nhận các đơn hàng đang chọn"
                                    />
                                </div>
                                <div title="option-2">
                                    <input
                                        id="option-2"
                                        name="option"
                                        type="radio"
                                        value="delivering"
                                        checked={bulkAction === 'delivering'}
                                        onChange={() => {
                                            if (selectedOrderIds.length > 0) {
                                                setBulkAction('delivering')
                                            }
                                        }}
                                    />
                                    <label
                                        className="option"
                                        htmlFor="option-2"
                                        data-txt="Xác nhận giao hàng các đơn đang chọn"
                                    />
                                </div>

                                <div title="option-3">
                                    <input
                                        id="option-3"
                                        name="option"
                                        type="radio"
                                        value="delivered"
                                        checked={bulkAction === 'delivered'}
                                        onChange={() => {
                                            if (selectedOrderIds.length > 0) {
                                                setBulkAction('delivered')
                                            }
                                        }}
                                    />
                                    <label
                                        className="option"
                                        htmlFor="option-3"
                                        data-txt="Xác nhận đã giao các đơn đang chọn"
                                    />
                                </div>

                                <div title="option-4">
                                    <input
                                        id="option-4"
                                        name="option"
                                        type="radio"
                                        value="printInvoice"
                                        checked={bulkAction === 'printInvoice'}
                                        onChange={() => {
                                            handlePrintInvoiceMany()
                                        }}
                                    />
                                    <label
                                        className="option"
                                        htmlFor="option-4"
                                        data-txt="In hóa đơn các đơn hàng đang chọn"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-3">
                    <div className="border rounded-2 p-3">
                        <div className="order-grid py-3 border-bottom">
                            <div className="checkbox-cell">
                                <label className="d-flex align-items-center">
                                    <input
                                        type="checkbox"
                                        className="input-checkbox"
                                        checked={selectedOrderIds.length === orders.length}
                                        onChange={handleSelectAllOrders}
                                    />
                                    <span className="custom-checkbox"></span>
                                </label>
                            </div>
                            <p className="fs-4 fw-medium text-center">Khách hàng</p>
                            <p className="fs-4 fw-medium text-center">Sản phẩm</p>
                            <p className="fs-4 fw-medium text-center">Ngày đặt hàng</p>
                            <p className="fs-4 fw-medium text-center">Hình thức vận chuyển</p>
                            <p className="fs-4 fw-medium text-center">Hình thức thanh toán</p>
                            <p className="fs-4 fw-medium text-center">Tổng tiền</p>
                            <p className="fs-4 fw-medium text-center">Trạng thái</p>
                            <div className="px-5"></div>
                        </div>
                        {status === 'loading' ? (
                            <section className="dots-container mt-4">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </section>
                        ) : status === 'failed' ? (
                            <p>{error}</p>
                        ) : !orders || orders.length === 0 ? (
                            <p className="fs-3 fw-medium text-center">Không có đơn hàng nào</p>
                        ) : (
                            orders.map((order) => (
                                <div key={order._id} className="order-grid py-3 border-bottom">
                                    <div className="checkbox-cell">
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="input-checkbox"
                                                checked={selectedOrderIds.includes(order._id)}
                                                onChange={() => handleSelectOrder(order._id)}
                                            />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                    </div>
                                    <div className="overflow-y-auto mt-5 ">
                                        <div className="d-inline-flex align-items-center w-100 ">
                                            <img
                                                src={order.user?.urlImage || defaultAvatar}
                                                alt=""
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                }}
                                            />
                                            <div className="ms-3 order-product-info">
                                                <p
                                                    className="fs-4 fw-medium overflow-hidden text-nowrap"
                                                    style={{ textOverflow: 'ellipsis', maxWidth: '100%' }}
                                                >
                                                    {order.user?.name}
                                                </p>
                                                <p
                                                    className="fs-4 overflow-hidden text-nowrap"
                                                    style={{ textOverflow: 'ellipsis', maxWidth: '100%' }}
                                                >
                                                    {order.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <FontAwesomeIcon
                                            icon={faComment}
                                            className="fs-3 p-2 hover-icon"
                                            color="#4a90e2"
                                        />
                                    </div>
                                    <div className="overflow-y-auto scrollbar-y" style={{ maxHeight: '150px' }}>
                                        {order.products?.map((product) => (
                                            <div key={product._id} className="d-flex align-items-center my-2">
                                                <img
                                                    src={product.product?.imageUrl}
                                                    alt=""
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                                <div className="ms-3 order-product-info">
                                                    <p
                                                        className="fs-4 fw-medium overflow-hidden text-nowrap"
                                                        style={{ textOverflow: 'ellipsis', maxWidth: '100%' }}
                                                    >
                                                        {product.product?.product?.name}
                                                    </p>
                                                    <p className="fs-4">x{product?.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="fs-4 text-center">
                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className="fs-4 text-center">
                                        {order.shippingMethod === 'basic'
                                            ? 'Cơ bản'
                                            : order.shippingMethod === 'fast'
                                            ? 'Nhanh'
                                            : 'Hỏa tốc'}
                                    </p>
                                    <p className="fs-4 text-center">
                                        {order.paymentMethod === 'bankTransfer'
                                            ? 'Thanh toán chuyển khoản'
                                            : 'Thanh toán khi nhận hàng'}
                                    </p>
                                    <p className="fs-4 text-center">{order.totalPrice.toLocaleString('vi-VN')}đ</p>
                                    <div className="text-center">
                                        <p
                                            className={`text-center ${
                                                order.status === 'cancelled'
                                                    ? 'text-danger'
                                                    : order.status === 'delivered'
                                                    ? 'text-success'
                                                    : 'text-warning'
                                            }`}
                                        >
                                            {order.status === 'pending'
                                                ? 'Chờ xác nhận'
                                                : order.status === 'processing'
                                                ? 'Đang xử lý'
                                                : order.status === 'delivering'
                                                ? 'Đang giao'
                                                : order.status === 'delivered'
                                                ? 'Đã giao'
                                                : order.status === 'returned'
                                                ? 'Yêu cầu trả hàng'
                                                : 'Đã hủy'}
                                        </p>
                                        {order.status === 'returned' && (
                                            <p
                                                className={
                                                    order.statusReason === 'pending'
                                                        ? 'text-warning'
                                                        : order.statusReason === 'approved'
                                                        ? 'text-success'
                                                        : 'text-danger'
                                                }
                                            >
                                                {order.statusReason === 'pending'
                                                    ? 'Chờ xác nhận'
                                                    : order.statusReason === 'approved'
                                                    ? 'Đã xác nhận'
                                                    : 'Đã từ chối'}
                                            </p>
                                        )}
                                        {order.status !== 'cancelled' && (
                                            <FontAwesomeIcon
                                                onClick={() => {
                                                    if (order.status !== 'returned') {
                                                        setShowChangeStatusModal({
                                                            show: true,
                                                            originalStatus: order.status,
                                                            orderId: order._id,
                                                        })
                                                    } else {
                                                        setShowReturnModal({
                                                            show: true,
                                                            orderId: order._id,
                                                        })
                                                    }
                                                }}
                                                icon={faPen}
                                                className="fs-3 p-2 hover-icon"
                                                color="#4a90e2"
                                            />
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center flex-column">
                                        <FontAwesomeIcon
                                            icon={faCircleInfo}
                                            className="fs-3 my-2 p-2 hover-icon"
                                            color="#000"
                                            onClick={() => setShowDetailOrder({ show: true, orderId: order._id })}
                                        />
                                        <p
                                            className="fs-5 text-primary hover-icon p-2"
                                            onClick={() => handlePrintInvoice(order)}
                                        >
                                            In hóa đơn
                                        </p>
                                        {order.status !== 'cancelled' && (
                                            <p className="fs-5 text-danger hover-icon p-2">Hủy đơn</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {showChangeStatusModal.show && (
                <ChangeStatusModal
                    show={showChangeStatusModal.show}
                    onHide={() => setShowChangeStatusModal({ show: false, originalStatus: '', orderId: '' })}
                    originalStatus={showChangeStatusModal.originalStatus}
                    orderId={showChangeStatusModal.orderId}
                    setShowNotifyModal={setShowNotifyModal}
                />
            )}
            {/* {showNotifyModal.show && (
                <Modal
                    show={showNotifyModal.show}
                    onHide={() => setShowNotifyModal({ show: false, description: '', title: '', type: '' })}
                    centered
                >
                    <Notification
                        description={showNotifyModal.description}
                        title={showNotifyModal.title}
                        type={showNotifyModal.type}
                    />
                </Modal>
            )} */}
            {showDetailOrder.show && (
                <DetailModal
                    show={showDetailOrder.show}
                    onHide={() => setShowDetailOrder({ show: false, orderId: '' })}
                    orderId={showDetailOrder.orderId}
                />
            )}
            {showReturnModal.show && (
                <ReturnModal
                    show={showReturnModal.show}
                    onHide={() => {
                        setShowReturnModal({ show: false, orderId: '' })
                        dispatch(getAdminOrdersAction(filters))
                    }}
                    orderId={showReturnModal.orderId}
                    onSuccess={() => {
                        setShowReturnModal({ show: false, orderId: '' })
                        dispatch(getAdminOrdersAction(filters))
                    }}
                />
            )}
        </div>
    )
}

export default OrderManagement
