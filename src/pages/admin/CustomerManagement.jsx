import './CustomerManagement.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faEye, faGift, faBan, faUnlockKeyhole, faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchClients, fetchOrderUser, unblockClientAction, unblockManyClientAction, fetchOrdersByUserId } from '../../redux/slices/userSlice'
import defaultAvatar from '../../assets/image/default/default-avatar.png'
import GiveVoucher from '../../components/GiveVoucher'
import Notification from '../../components/Notification'
import BlockClientModal from '../../components/BlockClientModal'
import UpdateClientTypeModal from '../../components/UpdateClientTypeModal'
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from 'react-router-dom'

function CustomerManagement() {
    const navigate = useNavigate()
    const { clients, clientsLoading } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [clientFilters, setClientFilters] = useState({
        name: '',
        phone: '',
        totalSpent: '',
        orderCount: '',
    })
    const [clientType, setClientType] = useState('')
    const [userIds, setUserIds] = useState([])
    const [userId, setUserId] = useState(null)
    const [blockUserIds, setBlockUserIds] = useState([])
    const [updateClientType, setUpdateClientType] = useState([])
    const [selectedClient, setSelectedClient] = useState([])
    const [bulkAction, setBulkAction] = useState('')
    const [notification, setNotification] = useState({
        show: false,
        title: '',
        description: '',
        type: '',
    })
    const [showOrderHistory, setShowOrderHistory] = useState(false)
    const [selectedOrderHistory, setSelectedOrderHistory] = useState(null)

    useEffect(() => {
        dispatch(fetchClients({ ...clientFilters, clientType }))
    }, [dispatch, clientType])

    const handleChangeClientFilters = (name, value) => {
        setClientFilters({ ...clientFilters, [name]: value })
    }

    const handleConfirmClientFilters = () => {
        dispatch(fetchClients({ ...clientFilters, clientType }))
    }

    useEffect(() => {
        dispatch(fetchOrderUser())
    }, [user])

    const handleResetClientFilters = () => {
        const defaultClientFilters = {
            name: '',
            phone: '',
            totalSpent: '',
            orderCount: '',
        }
        setClientFilters(defaultClientFilters)
        dispatch(fetchClients({ ...defaultClientFilters, clientType }))
    }

    const handleUnblockClient = async (userId) => {
        try {
            await dispatch(unblockClientAction({ userId })).unwrap()
            setNotification({
                show: true,
                title: 'Thành công',
                description: 'Khách hàng đã được mở khóa',
                type: 'success',
            })
        } catch (error) {
            setNotification({
                show: true,
                title: 'Thất bại',
                description: error.message,
                type: 'error',
            })
        }
    }

    const handleUnblockClients = async () => {
        try {
            await dispatch(unblockManyClientAction({ userIds: selectedClient })).unwrap()
            setNotification({
                show: true,
                title: 'Thành công',
                description: 'Những khách hàng đã được mở khóa',
                type: 'success',
            })
            setSelectedClient([])
        } catch (error) {
            setNotification({
                show: true,
                title: 'Thất bại',
                description: error.message,
                type: 'error',
            })
        } finally {
            setBulkAction('')
        }
    }

    const handleViewOrderHistory = (client) => {
        setSelectedOrderHistory(client)
        setShowOrderHistory(true)
        dispatch(fetchOrdersByUserId(client._id))
    }

    return (
        <div className="pb-5">
            <div className="bg-white border">
                <p className="fs-3 fw-medium p-3 border-bottom">Quản lý khách hàng</p>
                <div className="row p-3 g-4 mx-2">
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium me-4 label-width ">Tên khách hàng</p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input
                                type="text"
                                className="input-text w-100"
                                value={clientFilters.name}
                                onChange={(e) => handleChangeClientFilters('name', e.target.value)}
                                placeholder="Tên khách hàng"
                            />
                        </div>
                    </div>
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium me-4 label-width ">Số điện thoại</p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input
                                type="number"
                                className="input-text w-100"
                                value={clientFilters.phone}
                                onChange={(e) => handleChangeClientFilters('phone', e.target.value)}
                                placeholder="Số điện thoại"
                            />
                        </div>
                    </div>
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium me-4 label-width ">Tổng tiền mua hàng</p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input
                                type="number"
                                className="input-text w-100"
                                value={clientFilters.totalSpent}
                                onChange={(e) => handleChangeClientFilters('totalSpent', e.target.value)}
                                placeholder="Tổng tiền mua hàng"
                            />
                        </div>
                    </div>
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium me-4 label-width ">Số lần mua hàng ở shop</p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input
                                type="number"
                                className="input-text w-100"
                                value={clientFilters.orderCount}
                                onChange={(e) => handleChangeClientFilters('orderCount', e.target.value)}
                                placeholder="Số lần mua hàng ở shop"
                            />
                        </div>
                    </div>
                </div>
                <div className="d-flex p-3 justify-content-center border-top align-items-center mt-3">
                    <button className="primary-btn shadow-none py-1 px-4 rounded-2 border-1" onClick={handleConfirmClientFilters}>
                        <p className="fs-4 fw-medium">Tìm</p>
                    </button>

                    <button className="ms-3 py-1 px-4 rounded-2 border bg-white" onClick={handleResetClientFilters}>
                        <p className="fs-4 fw-medium">Nhập lại</p>
                    </button>
                </div>
            </div>
            <div className="bg-white border mt-3 ">
                <div className=" border-bottom d-flex">
                    <p className={`fs-4 py-3 px-4 order-tab-item ${clientType === '' ? 'active' : ''}`} onClick={() => setClientType('')}>
                        Tất cả
                    </p>
                    <p className={`fs-4 py-3 px-4 order-tab-item ${clientType === 'new' ? 'active' : ''}`} onClick={() => setClientType('new')}>
                        Khách hàng mới
                    </p>
                    <p className={`fs-4 py-3 px-4 order-tab-item ${clientType === 'potential' ? 'active' : ''}`} onClick={() => setClientType('potential')}>
                        Khách hàng tiềm năng
                    </p>
                    <p className={`fs-4 py-3 px-4 order-tab-item ${clientType === 'loyal' ? 'active' : ''}`} onClick={() => setClientType('loyal')}>
                        Khách hàng thân thiết
                    </p>
                </div>
                <div className="p-3 d-flex align-items-center justify-content-between">
                    <p className="fs-3 fw-medium">100 khách hàng</p>
                    <div className="select ">
                        <div
                            className="selected"
                            data-default="Công cụ xử lý hàng loạt"
                            data-one="Chặn các khách hàng đang chọn"
                            data-two="Mở khóa các khách hàng đang chọn"
                            data-three="Thay đổi loại khách hàng các khách hàng đang chọn"
                            data-four="Tặng voucher các khách hàng đang chọn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                            </svg>
                        </div>
                        <div className="options">
                            <div title="all">
                                <input id="all-v2" name="option-v2" type="radio" value="" checked={bulkAction === ''} onChange={(e) => setBulkAction(e.target.value)} />
                                <label className="option" htmlFor="all-v2" data-txt="Công cụ xử lý hàng loạt" />
                            </div>
                            <div title="option-1">
                                <input
                                    id="option-1-v2"
                                    name="option-v2"
                                    type="radio"
                                    value="block"
                                    checked={bulkAction === 'block'}
                                    onChange={(e) => {
                                        if (selectedClient.length > 0) {
                                            setBulkAction(e.target.value)
                                            setBlockUserIds(selectedClient)
                                        }
                                    }}
                                />
                                <label className="option" htmlFor="option-1-v2" data-txt="Chặn các khách hàng đang chọn" />
                            </div>
                            <div title="option-2">
                                <input
                                    id="option-2-v2"
                                    name="option-v2"
                                    type="radio"
                                    value="unblock"
                                    checked={bulkAction === 'unblock'}
                                    onChange={(e) => {
                                        if (selectedClient.length > 0) {
                                            setBulkAction(e.target.value)
                                            handleUnblockClients()
                                        }
                                    }}
                                />
                                <label className="option" htmlFor="option-2-v2" data-txt="Mở khóa các khách hàng đang chọn" />
                            </div>
                            <div title="option-3">
                                <input
                                    id="option-3-v2"
                                    name="option-v2"
                                    type="radio"
                                    value="update"
                                    checked={bulkAction === 'update'}
                                    onChange={(e) => {
                                        if (selectedClient.length > 0) {
                                            setBulkAction(e.target.value)
                                            setUpdateClientType(selectedClient)
                                        }
                                    }}
                                />
                                <label className="option" htmlFor="option-3-v2" data-txt="Thay đổi loại các khách hàng đang chọn" />
                            </div>
                            <div title="option-4">
                                <input
                                    id="option-4-v2"
                                    name="option-v2"
                                    type="radio"
                                    value="give-voucher"
                                    checked={bulkAction === 'give-voucher'}
                                    onChange={(e) => {
                                        if (selectedClient.length > 0) {
                                            setBulkAction(e.target.value)
                                            setUserIds(selectedClient)
                                        }
                                    }}
                                />
                                <label className="option" htmlFor="option-4-v2" data-txt="Tặng voucher các khách hàng đang chọn" />
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
                                        checked={selectedClient.length === clients.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedClient(clients.map((client) => client._id))
                                            } else {
                                                setSelectedClient([])
                                            }
                                        }}
                                    />
                                    <span className="custom-checkbox"></span>
                                </label>
                            </div>
                            <p className="fs-4 fw-medium text-center">Khách hàng</p>
                            <p className="fs-4 fw-medium text-center">Số điện thoại</p>
                            <p className="fs-4 fw-medium text-center">Giới tính</p>
                            <p className="fs-4 fw-medium text-center">Ngày sinh</p>
                            <p className="fs-4 fw-medium text-center">Tổng tiền mua hàng</p>
                            <p className="fs-4 fw-medium text-center">Số lần mua hàng ở shop</p>
                            <p className="fs-4 fw-medium text-center">Trạng thái</p>
                            <div className="px-4"></div>
                        </div>
                        {clientsLoading ? (
                            <section className="dots-container mt-4">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </section>
                        ) : (
                            clients.map((client) => (
                                <div key={client._id} className="order-grid py-3 border-bottom">
                                    <div className="checkbox-cell">
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="input-checkbox"
                                                checked={selectedClient.includes(client._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedClient([...selectedClient, client._id])
                                                    } else {
                                                        setSelectedClient(selectedClient.filter((id) => id !== client._id))
                                                    }
                                                }}
                                            />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                    </div>
                                    <div className="overflow-y-auto mt-5">
                                        <div className="d-inline-flex align-items-center w-100">
                                            <img src={client.urlImage || defaultAvatar} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} />
                                            <div className="ms-3 order-product-info">
                                                <p className="fs-4 fw-medium overflow-hidden text-nowrap" style={{ textOverflow: 'ellipsis', maxWidth: '100%' }}>
                                                    {client.name || client.email.split('@')[0]}
                                                </p>
                                                <p className="fs-4 overflow-hidden text-nowrap" style={{ textOverflow: 'ellipsis', maxWidth: '100%' }}>
                                                    {client.email}
                                                </p>
                                            </div>
                                        </div>
                                        <FontAwesomeIcon
                                            icon={faComment}
                                            onClick={() =>
                                                navigate(`/seller/chat/${client._id}`, {
                                                    state: {
                                                        user: {
                                                            _id: client._id,
                                                            name: client.name || client.email.split('@')[0],
                                                            email: client.email,
                                                            avatar: client.urlImage,
                                                        },
                                                    },
                                                })
                                            }
                                            className="fs-3 p-2 hover-icon"
                                            color="#4a90e2"
                                        />
                                    </div>
                                    <p className="fs-4 fw-medium text-center">{client.phone || 'Không có'}</p>
                                    <p className="fs-4 fw-medium text-center">{client.gender || 'Không có'}</p>
                                    <p className="fs-4 fw-medium text-center">{client.birthday ? new Date(client.birthday).toLocaleDateString('vi-VN') : 'Không có'}</p>
                                    <p className="fs-4 fw-medium text-center">{client.totalSpent}</p>
                                    <p className="fs-4 fw-medium text-center">{client.orderCount}</p>
                                    <p className={`fs-4 fw-medium text-center ${client.isBlocked ? 'text-danger' : 'text-success'}`}>{client.isBlocked ? 'Bị chặn' : 'Đang hoạt động'}</p>
                                    <div className="px-2 dropdown-container">
                                        <FontAwesomeIcon icon={faEllipsisVertical} className="fs-3 p-2 hover-icon" color="#4a90e2" />
                                        <div className="dropdown-menu">
                                            {!client.isBlocked ? (
                                                <>
                                                    <div className="dropdown-item d-flex align-items-center" onClick={() => setBlockUserIds([client._id])}>
                                                        <FontAwesomeIcon icon={faBan} className="fs-4 me-2" color="#e74c3c" />
                                                        <p className="fs-5 m-0">Chặn khách hàng</p>
                                                    </div>
                                                    <div className="dropdown-item d-flex align-items-center" onClick={() => handleViewOrderHistory(client)}>
                                                        <FontAwesomeIcon icon={faEye} className="fs-4 me-2" />
                                                        <p className="fs-5 m-0">Xem lịch sử mua hàng</p>
                                                    </div>
                                                    <div className="dropdown-item d-flex align-items-center" onClick={() => setUserIds([client._id])}>
                                                        <FontAwesomeIcon icon={faGift} className="fs-4 me-2" color="#4a90e2" />
                                                        <p className="fs-5 m-0">Tặng voucher</p>
                                                    </div>
                                                    <div className="dropdown-item d-flex align-items-center" onClick={() => setUpdateClientType([client._id])}>
                                                        <FontAwesomeIcon icon={faArrowsRotate} className="fs-4 me-2" color="#4a90e2" />
                                                        <p className="fs-5 m-0">Thay đổi loại khách hàng</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="dropdown-item d-flex align-items-center" onClick={() => handleUnblockClient(client._id)}>
                                                    <FontAwesomeIcon icon={faUnlockKeyhole} className="fs-4 me-2 text-success" />
                                                    <p className="fs-5 m-0">Mở khóa khách hàng</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {userIds.length > 0 && (
                <GiveVoucher isOpen={true} onClose={() => setUserIds([])} userId={userIds} setNotification={setNotification} setBulkAction={setBulkAction} setSelectedClient={setSelectedClient} />
            )}
            {blockUserIds.length > 0 && (
                <BlockClientModal
                    setBulkAction={setBulkAction}
                    setSelectedClient={setSelectedClient}
                    show={true}
                    onClose={() => setBlockUserIds([])}
                    userIds={blockUserIds}
                    setNotification={setNotification}
                />
            )}
            {updateClientType.length > 0 && (
                <UpdateClientTypeModal
                    setBulkAction={setBulkAction}
                    setSelectedClient={setSelectedClient}
                    show={true}
                    onClose={() => setUpdateClientType([])}
                    userIds={updateClientType}
                    setNotification={setNotification}
                />
            )}
            {notification.show && (
                <Modal show={notification.show} onHide={() => setNotification({ ...notification, show: false })} centered>
                    <Notification title={notification.title} description={notification.description} type={notification.type} />
                </Modal>
            )}
            <Modal show={showOrderHistory} onHide={() => setShowOrderHistory(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-4">Lịch sử mua hàng - {selectedOrderHistory?.name || selectedOrderHistory?.email?.split('@')[0]}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="p-3 overflow-y-auto" style={{ maxHeight: '500px' }}>
                        {console.log(userOrders)}
                        {userOrders.length > 0 ? (
                            userOrders.map((order) => (
                                <div key={order._id} className="border rounded p-3 mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <p className="fs-4 fw-medium">Mã đơn hàng: {order._id}</p>
                                        <p className="fs-4">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div className="mb-2">
                                        <p className="fs-4">
                                            Trạng thái:{' '}
                                            <span className="ps-2 text-uppercase me-3 fs-4">
                                                {order.status === 'processing' ? (
                                                    <span className="text-warning">Đang xử lý</span>
                                                ) : order.status === 'pending' ? (
                                                    <span className="text-pending ">Chờ xác nhận</span>
                                                ) : order.status === 'delivering' ? (
                                                    <span className="text-delivering">Đang giao hàng</span>
                                                ) : order.status === 'delivered' ? (
                                                    <span className="text-delivered">Đã giao</span>
                                                ) : order.status === 'cancelled' ? (
                                                    <span className="text-cancelled">Đã hủy</span>
                                                ) : null}{' '}
                                            </span>
                                        </p>
                                        <p className="fs-4">
                                            Tổng tiền: <span className="fw-medium">{order.productsPrice.toLocaleString('vi-VN')}đ</span>
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="w-50">
                                            <div className="mb-2">
                                                <p className="fs-4 fw-medium overflow-y-hidden">Sản phẩm:</p>
                                                {order.products.map((item, index) => (
                                                    <div key={index} className="d-flex align-items-center mb-2">
                                                        <img src={item.product.imageUrl} alt="Product image" style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="me-3" />
                                                        <div>
                                                            <p className="fs-4">{item.product.product.name}</p>
                                                            <p className="fs-4">Số lượng: {item.quantity}</p>
                                                            <p className="fs-4">
                                                                Phân loại hàng:{' '}
                                                                {item.product.product.categories.map((categorie, index) => (
                                                                    <span key={index} className="ms-2">
                                                                        {categorie.name}
                                                                    </span>
                                                                ))}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="w-50 ps-4 border-start">
                                            <div className="mb-3">
                                                <p className="fs-4 fw-medium">Thông tin giao hàng:</p>
                                                <p className="fs-4 fw-medium">
                                                    Người nhận: <span className="fw-normal">{order.shippingAddress?.name}</span>
                                                </p>
                                                <p className="fs-4 fw-medium">
                                                    SĐT: <span className="fw-normal">{order.shippingAddress?.phone}</span>
                                                </p>
                                                <p className="fs-4 fw-medium">
                                                    Địa chỉ: <span className="fw-normal">{order.shippingAddress?.location}</span>
                                                </p>
                                            </div>

                                            <div className="mb-3">
                                                <p className="fs-4 fw-medium">Thanh toán:</p>
                                                <p className="fs-4">Phương thức: {order.paymentMethod === 'paymentUponReceipt' ? 'Thanh toán sau khi nhận hàng.' : 'Thanh toán qua thẻ.'}</p>
                                                <p className="fs-4">Tạm tính: {order.productsPrice?.toLocaleString('vi-VN')}đ</p>
                                                <p className="fs-4">Phí vận chuyển: {order.shippingPrice?.toLocaleString('vi-VN')}đ</p>
                                                {order.vouchers?.length > 0 && <p className="fs-4">Giảm giá: -{order.voucherDiscount?.toLocaleString('vi-VN')}đ</p>}
                                                <p className="fs-4 fw-medium">Tổng cộng: {order.totalPrice?.toLocaleString('vi-VN')}đ</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="fs-4 text-center">Khách hàng chưa có đơn hàng nào</p>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CustomerManagement
