import React, { useState, useEffect, useCallback } from 'react'
import DatePicker from 'react-datepicker'
import './OrderManagement.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminOrdersAction, setFilters, updateOrderStatusManyAction } from '../../redux/slices/orderSilce'
import ChangeStatusModal from '../../components/ChangeStatusModal'
import Notification from '../../components/Notification'
import Modal from 'react-bootstrap/Modal'
import debounce from 'lodash/debounce'
import defaultAvatar from '../../assets/image/default/default-avatar.png'

const OrderManagement = () => {
    const dispatch = useDispatch()
    const { orders, status, error, filters } = useSelector((state) => state.order)
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
    // state
    const [filterStatus, setFilterStatus] = useState('')
    const [filterLocal, setFilterLocal] = useState({
        productName: '',
        orderStartDate: null,
        orderEndDate: null,
        paymentMethod: 'paymentUponReceipt',
        shippingMethod: '',
    })
    const [selectedOrderIds, setSelectedOrderIds] = useState([])
    const [bulkAction, setBulkAction] = useState('')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showDetailOrder, setShowDetailOrder] = useState(false)

    const debouncedFetchOrders = useCallback(
        debounce(() => {
            dispatch(getAdminOrdersAction(filters))
        }, 300),
        [dispatch, filters]
    )

    useEffect(() => {
        console.log(orders)
    }, [orders])

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
            await dispatch(updateOrderStatusManyAction({ orderIds: selectedOrderIds, status: bulkAction }))
            setShowNotifyModal({
                show: true,
                description: 'Cập nhật trạng thái đơn hàng thành công',
                title: 'Thành công',
                type: 'success',
            })
            setSelectedOrderIds([])
        } catch (error) {
            setShowNotifyModal({ show: true, description: error.message, title: 'Thất bại', type: 'error' })
        } finally {
            setBulkAction('')
        }
    }

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

    const handleShowDetail = (order) => {
        setSelectedOrder(order)
        setShowDetailOrder(true)
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
                                            checked={filterLocal.shippingMethod === ''}
                                            value=""
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
                                    data-default="Thanh toán khi nhận hàng"
                                    data-one="Thanh toán chuyển khoản"
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
                                            checked={filterLocal.paymentMethod === 'paymentUponReceipt'}
                                            value="paymentUponReceipt"
                                            onChange={(e) => handleChangeFilter('paymentMethod', e.target.value)}
                                        />
                                        <label
                                            className="option"
                                            htmlFor="all-v3"
                                            data-txt="Thanh toán khi nhận hàng"
                                        />
                                    </div>
                                    <div title="option-1">
                                        <input
                                            id="option-1-v3"
                                            name="option-v3"
                                            type="radio"
                                            checked={filterLocal.paymentMethod === 'bankTransfer'}
                                            value="bankTransfer"
                                            onChange={(e) => handleChangeFilter('paymentMethod', e.target.value)}
                                        />
                                        <label
                                            className="option"
                                            htmlFor="option-1-v3"
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
                <div className=" border-bottom d-flex">
                    <p
                        className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === '' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('')}
                    >
                        Tất cả
                    </p>
                    <p
                        className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('pending')}
                    >
                        Chờ xác nhận
                    </p>
                    <p
                        className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === 'processing' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('processing')}
                    >
                        Đang xử lý
                    </p>
                    <p
                        className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === 'delivering' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('delivering')}
                    >
                        Đang giao
                    </p>
                    <p
                        className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === 'delivered' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('delivered')}
                    >
                        Đã giao
                    </p>
                    <p
                        className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('cancelled')}
                    >
                        Đã hủy
                    </p>
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
                                data-three="In hóa đơn các đơn hàng đang chọn"
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
                                        value="printInvoice"
                                        checked={bulkAction === 'printInvoice'}
                                        onChange={() => {
                                            handlePrintInvoiceMany()
                                        }}
                                    />
                                    <label
                                        className="option"
                                        htmlFor="option-3"
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
                                                : 'Đã hủy'}
                                        </p>
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                setShowChangeStatusModal({
                                                    show: true,
                                                    originalStatus: order.status,
                                                    orderId: order._id,
                                                })
                                            }
                                            icon={faPen}
                                            className="fs-3 p-2 hover-icon"
                                            color="#4a90e2"
                                        />
                                    </div>
                                    <div className="d-flex align-items-center flex-column">
                                        <FontAwesomeIcon
                                            icon={faCircleInfo}
                                            className="fs-3 my-2 p-2 hover-icon"
                                            color="#000"
                                            onClick={() => handleShowDetail(order)}
                                        />
                                        <p
                                            className="fs-5 text-primary hover-icon p-2"
                                            onClick={() => handlePrintInvoice(order)}
                                        >
                                            In hóa đơn
                                        </p>
                                        <p className="fs-5 text-danger hover-icon p-2">Hủy đơn</p>
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
            {showNotifyModal.show && (
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
            )}
            {showDetailOrder && (
                <Modal show={showDetailOrder} onHide={handleCloseOrder} centered size="lg">
                    <Modal.Header closeButton>
                        <p className="fs-2 fw-bold">Chi tiết đơn hàng</p>
                    </Modal.Header>
                    <Modal.Body>
                        {console.log(selectedOrder)}
                        <div className="d-flex justify-content-between">
                            <div className="col-8 pe-4">
                                <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-3 bg-light rounded border">
                                    <div className="text-start">
                                        <span className="fs-3 fw-semibold">
                                            Đơn hàng:{' '}
                                            <span className="text-primary fs-4 fw-normal text-nowrap">
                                                {selectedOrder._id}
                                            </span>
                                        </span>
                                        <div className="fs-5">
                                            <span className="me-2">
                                                {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                            <span className="ms-2">
                                                {new Date(selectedOrder.createdAt).toLocaleTimeString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p
                                            className={`text-center ${
                                                selectedOrder.status === 'cancelled'
                                                    ? 'text-danger'
                                                    : selectedOrder.status === 'delivered'
                                                    ? 'text-success'
                                                    : 'text-warning'
                                            }`}
                                        >
                                            {selectedOrder.status === 'pending'
                                                ? 'Chờ xác nhận'
                                                : selectedOrder.status === 'processing'
                                                ? 'Đang xử lý'
                                                : selectedOrder.status === 'delivering'
                                                ? 'Đang giao'
                                                : selectedOrder.status === 'delivered'
                                                ? 'Đã giao'
                                                : 'Đã hủy'}
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div
                                        className="shadow-none p-3 mb-3 bg-white rounded border me-4"
                                        style={{ minWidth: '200px' }}
                                    >
                                        <p className="fs-4 fw-semibold bg-light info-title">KHÁCH HÀNG</p>
                                        <p className="fs-5 fw-normal text-nowrap my-2">{selectedOrder?.user?.name}</p>
                                        <p className="fs-5 fw-normal">{selectedOrder?.user?.phone}</p>
                                    </div>
                                    <div
                                        className="shadow-none p-3 mb-3 bg-white rounded border"
                                        style={{ flexGrow: 1 }}
                                    >
                                        <p className="fs-4 fw-semibold bg-light info-title">NGƯỜI NHẬN</p>
                                        <p className="fs-5 fw-normal text-nowrap my-2">{selectedOrder?.user?.name}</p>
                                        <p className="fs-5 fw-normal">{selectedOrder?.user?.phone}</p>
                                        <p className="fs-5 fw-normal">{selectedOrder?.shippingAddress?.location}</p>
                                    </div>
                                </div>

                                <div className="d-flex py-3 border-bottom">
                                    <div className="fs-4 fw-medium text-center" style={{ width: '5%' }}>
                                        STT
                                    </div>
                                    <div className="fs-4 fw-medium text-start ms-3" style={{ width: '40%' }}>
                                        Tên sản phẩm
                                    </div>
                                    <div className="fs-4 fw-medium text-center" style={{ width: '20%' }}>
                                        Giá
                                    </div>
                                    <div className="fs-4 fw-medium text-center" style={{ width: '15%' }}>
                                        Số lượng
                                    </div>
                                    <div className="fs-4 fw-medium text-center" style={{ width: '20%' }}>
                                        Tổng tiền
                                    </div>
                                </div>

                                <div className="overflow-y-auto" style={{ maxHeight: '150px' }}>
                                    {selectedOrder?.products.map((product, index) => (
                                        <div key={index} className="d-flex align-items-center py-2 border-bottom">
                                            <div className="text-center" style={{ width: '5%' }}>
                                                {index + 1}
                                            </div>
                                            <div className="text-start" style={{ width: '40%' }}>
                                                <div className="ms-3 d-flex align-items-center">
                                                    <img
                                                        src={product.product?.imageUrl}
                                                        alt=""
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    />
                                                    <p
                                                        className="fs-5 fw-medium overflow-hidden d-flex aglin-items-center ms-2"
                                                        style={{ maxWidth: '100%' }}
                                                    >
                                                        {product.product?.product?.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className="text-center fs-5 d-flex flex-column"
                                                style={{ width: '20%' }}
                                            >
                                                <span>{product?.product?.price.toLocaleString('vi-VN')}đ</span>
                                                {product?.product?.product?.originalPrice && (
                                                    <span
                                                        style={{
                                                            textDecoration: 'line-through',
                                                            color: 'gray',
                                                            fontSize: '0.9em',
                                                            marginLeft: '5px',
                                                        }}
                                                    >
                                                        {product?.product?.product?.originalPrice?.toLocaleString(
                                                            'vi-VN'
                                                        )}
                                                        đ
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-center fs-5" style={{ width: '15%' }}>
                                                {product.quantity}
                                            </div>

                                            <div className="text-center fs-5" style={{ width: '20%' }}>
                                                <span>
                                                    {(product?.product?.price * product?.quantity).toLocaleString(
                                                        'vi-VN'
                                                    )}
                                                    đ
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-4">
                                <div
                                    className="shadow-none p-3 mb-3 bg-white rounded border "
                                    style={{ minWidth: '200px' }}
                                >
                                    <p className="fs-4 fw-semibold bg-light info-title text-uppercase">
                                        Thông tin khác
                                    </p>
                                    <div className="d-flex justify-content-between mt-3">
                                        <p className="fs-5 fw-normal">
                                            {selectedOrder?.paymentMethod === 'paymentUponReceipt'
                                                ? 'Thanh toán khi nhận hàng:'
                                                : 'Thanh toán chuyển khoản:'}
                                        </p>
                                        <p className="fs-5 fw-normal">
                                            {selectedOrder?.totalPrice.toLocaleString('vi-VN')} đ
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-between mt-3">
                                        <p className="fs-5 fw-normal">Phương thức vận chuyển:</p>
                                        <p className="fs-5 fw-normal">
                                            {selectedOrder?.shippingMethod === 'basic'
                                                ? 'Cơ bản'
                                                : selectedOrder?.shippingMethod === 'fast'
                                                ? 'Nhanh'
                                                : 'Hỏa tốc'}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="shadow-none p-3 mb-3 bg-white rounded border d-flex flex-column"
                                    style={{ minWidth: '200px', minHeight: '250px' }}
                                >
                                    {/* Phần trên */}
                                    <div>
                                        <div className="d-flex justify-content-between">
                                            <p className="fs-5 fw-normal">Tạm tính</p>
                                            <p className="fs-5 fw-normal">
                                                {selectedOrder?.productsPrice.toLocaleString('vi-VN')} đ
                                            </p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p className="fs-5 fw-normal">Khuyến mãi</p>
                                            <p className="fs-5 fw-normal">
                                                {selectedOrder?.products
                                                    .reduce(
                                                        (total, item) => total + (item.product.product.discount || 0),
                                                        0
                                                    )
                                                    .toLocaleString('vi-VN')}
                                                đ
                                            </p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p className="fs-5 fw-normal">Phí vận chuyển</p>
                                            <p className="fs-5 fw-normal">
                                                {selectedOrder?.shippingPrice.toLocaleString('vi-VN')}đ
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phần tổng tiền */}
                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between">
                                            <p className="fs-3 fw-normal">Tổng tiền</p>
                                            <p className="fs-4 fw-normal text-center">
                                                {selectedOrder?.totalPrice.toLocaleString('vi-VN')}đ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div
                            className="primary-btn px-4 py-2 shadow-none light border rounded-3"
                            variant="secondary"
                            onClick={handleCloseOrder}
                        >
                            <p>Đóng</p>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    )
}

export default OrderManagement
