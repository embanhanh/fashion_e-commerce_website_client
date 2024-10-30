import './CustomerManagement.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faEye, faGift, faBan, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchClients } from '../../redux/slices/userSlice'
import defaultAvatar from '../../assets/image/default/default-avatar.png'
import GiveVoucher from '../../components/GiveVoucher'
import Notification from '../../components/Notification'
import BlockClientModal from '../../components/BlockClientModal'
import Modal from 'react-bootstrap/Modal'

function CustomerManagement() {
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
    const [blockUserIds, setBlockUserIds] = useState([])
    const [notification, setNotification] = useState({
        show: false,
        title: '',
        description: '',
        type: '',
    })

    useEffect(() => {
        dispatch(fetchClients({ ...clientFilters, clientType }))
    }, [dispatch, clientType])

    const handleChangeClientFilters = (name, value) => {
        setClientFilters({ ...clientFilters, [name]: value })
    }

    const handleConfirmClientFilters = () => {
        dispatch(fetchClients({ ...clientFilters, clientType }))
    }

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
                </div>
                <div className="p-3">
                    <div className="border rounded-2 p-3">
                        <div className="order-grid py-3 border-bottom">
                            <div className="checkbox-cell">
                                <label className="d-flex align-items-center">
                                    <input type="checkbox" className="input-checkbox" />
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
                                            <input type="checkbox" className="input-checkbox" />
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
                                        <FontAwesomeIcon icon={faComment} className="fs-3 p-2 hover-icon" color="#4a90e2" />
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
                                                    <div className="dropdown-item d-flex align-items-center">
                                                        <FontAwesomeIcon icon={faEye} className="fs-4 me-2" />
                                                        <p className="fs-5 m-0">Xem lịch sử mua hàng</p>
                                                    </div>
                                                    <div className="dropdown-item d-flex align-items-center" onClick={() => setUserIds([client._id])}>
                                                        <FontAwesomeIcon icon={faGift} className="fs-4 me-2" color="#4a90e2" />
                                                        <p className="fs-5 m-0">Tặng voucher</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="dropdown-item d-flex align-items-center">
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
            {userIds.length > 0 && <GiveVoucher isOpen={true} onClose={() => setUserIds([])} userId={userIds} setNotification={setNotification} />}
            {blockUserIds.length > 0 && <BlockClientModal show={true} onClose={() => setBlockUserIds([])} userIds={blockUserIds} setNotification={setNotification} />}
            {notification.show && (
                <Modal show={notification.show} onHide={() => setNotification({ ...notification, show: false })} centered>
                    <Notification title={notification.title} description={notification.description} type={notification.type} />
                </Modal>
            )}
        </div>
    )
}

export default CustomerManagement
