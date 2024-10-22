import React, { useEffect, useState } from 'react'
import './VoucherManagement.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getVouchersAction, deleteManyVoucherAction } from '../../redux/slices/voucherSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPen, faTrashCan, faShare } from '@fortawesome/free-solid-svg-icons'
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase.config'
import Modal from 'react-bootstrap/Modal'
import Notification from '../../components/Notification'

const VoucherManagement = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { vouchers, status, error } = useSelector((state) => state.voucher)
    const [voucherImages, setVoucherImages] = useState([])
    const [selectedVoucher, setSelectedVoucher] = useState([])
    const [filters, setFilters] = useState({ code: '', voucherType: '', status: '' })
    const [filteredVouchers, setFilteredVouchers] = useState([])
    const [bulkAction, setBulkAction] = useState('')
    const [selectedVoucherIds, setSelectedVoucherIds] = useState([])
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    const [notificationType, setNotificationType] = useState('')
    const [notificationTitle, setNotificationTitle] = useState('')

    const fetchVoucherImages = async () => {
        const vouchersRef = ref(storage, 'vouchers')
        try {
            const result = await listAll(vouchersRef)
            const urlPromises = result.items.map((imageRef) => getDownloadURL(imageRef))
            const urls = await Promise.all(urlPromises)
            setVoucherImages(urls)
        } catch (error) {
            console.error('Error fetching voucher images:', error)
        }
    }

    useEffect(() => {
        dispatch(getVouchersAction())
        fetchVoucherImages()
    }, [dispatch])

    useEffect(() => {
        setFilteredVouchers(vouchers)
    }, [dispatch, vouchers])

    const handleSelectVoucher = (voucherId) => {
        setSelectedVoucher((prevSelected) => {
            if (prevSelected.includes(voucherId)) {
                return prevSelected.filter((id) => id !== voucherId)
            } else {
                return [...prevSelected, voucherId]
            }
        })
    }

    const handleSelectAllVoucher = (e) => {
        if (e.target.checked) {
            setSelectedVoucher(filteredVouchers.map((voucher) => voucher._id))
        } else {
            setSelectedVoucher([])
        }
    }

    const handleFilterChange = (name, value) => {
        setFilters({ ...filters, [name]: value })
    }

    const handleConfirmFilters = () => {
        setFilteredVouchers(
            vouchers.filter((voucher) => {
                const isMatchStatus =
                    (filters.status === '' ||
                        (filters.status === 'upcoming' && new Date(voucher.validFrom) > new Date()) ||
                        (filters.status === 'ongoing' && new Date(voucher.validFrom) <= new Date() && new Date(voucher.validUntil) >= new Date()) ||
                        (filters.status === 'ended' && new Date(voucher.validUntil) < new Date())) &&
                    voucher.code.toLowerCase().trim().includes(filters.code.toLowerCase().trim()) &&
                    (filters.voucherType === '' || voucher.voucherType === filters.voucherType)
                return isMatchStatus
            })
        )
    }

    const handleResetFilters = () => {
        setFilters({ code: '', voucherType: '', status: '' })
    }

    const handleDeleteVoucher = (voucherId) => {
        setSelectedVoucherIds([voucherId])
    }

    const handleDeleteSelectedVouchers = async () => {
        if (selectedVoucherIds.length > 0) {
            try {
                await dispatch(deleteManyVoucherAction(selectedVoucherIds))
                setNotificationTitle('Thành công')
                setNotificationMessage('Xóa voucher thành công')
                setNotificationType('success')
                setShowNotification(true)
                setSelectedVoucherIds([])
                setSelectedVoucher([])
                setBulkAction('')
            } catch (error) {
                setNotificationTitle('Thất bại')
                setNotificationMessage('Xóa voucher thất bại: ' + error.message)
                setNotificationType('error')
                setShowNotification(true)
            }
        }
    }

    useEffect(() => {
        if (bulkAction === 'deleteSelectedVouchers' && selectedVoucher.length > 0) {
            setSelectedVoucherIds(selectedVoucher)
        }
    }, [bulkAction])

    useEffect(() => {
        handleConfirmFilters()
    }, [filters.status])

    return (
        <div className=" pb-5">
            <div className="bg-white border">
                <p className="fs-3 fw-medium p-3 border-bottom">Quản lý Voucher</p>
                <div className="row p-3 g-4">
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium text-nowrap me-4 label-width text-end">Mã giảm giá</p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input type="text" className="input-text w-100" placeholder="Mã voucher" value={filters.code} onChange={(e) => handleFilterChange('code', e.target.value)} />
                        </div>
                    </div>
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium text-nowrap me-4 label-width text-end">Loại mã</p>
                        <div className="d-flex align-items-center">
                            <div className="select ">
                                <div className="selected" data-default="Tất cả" data-one="Giảm giá toàn Shop" data-two="Giảm giá theo sản phẩm">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="all">
                                        <input id="all-v2" name="option-v2" type="radio" defaultChecked value="" onChange={(e) => handleFilterChange('voucherType', e.target.value)} />
                                        <label className="option" htmlFor="all-v2" data-txt="Tất cả" />
                                    </div>
                                    <div title="option-1">
                                        <input id="option-1-v2" name="option-v2" type="radio" value="all" onChange={(e) => handleFilterChange('voucherType', e.target.value)} />
                                        <label className="option" htmlFor="option-1-v2" data-txt="Giảm giá toàn Shop" />
                                    </div>
                                    <div title="option-2">
                                        <input id="option-2-v2" name="option-v2" type="radio" value="product" onChange={(e) => handleFilterChange('voucherType', e.target.value)} />
                                        <label className="option" htmlFor="option-2-v2" data-txt="Giảm giá theo sản phẩm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex p-3 justify-content-center align-items-center">
                    <button className="primary-btn shadow-none py-1 px-4 rounded-2 border-1" onClick={handleConfirmFilters}>
                        <p className="fs-4 fw-medium">Tìm</p>
                    </button>

                    <button className="ms-3 py-1 px-4 rounded-2 border bg-white" onClick={handleResetFilters}>
                        <p className="fs-4 fw-medium">Nhập lại</p>
                    </button>
                </div>
            </div>
            <div className="bg-white border mt-3">
                <p className="fs-3 fw-medium p-3 border-bottom">Danh sách voucher</p>
                <div className="p-3 d-flex align-items-center justify-content-between">
                    <p className="fs-3 fw-medium">{filteredVouchers.length} voucher</p>
                    <div className="d-flex">
                        <div className="select ">
                            <div className="selected" data-default="Công cụ xử lý hàng loạt" data-one="Xóa các voucher đang chọn">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            </div>
                            <div className="options">
                                <div title="all">
                                    <input id="all-v3" name="option-v3" type="radio" checked={bulkAction === ''} value="" onChange={(e) => setBulkAction(e.target.value)} />
                                    <label className="option" htmlFor="all-v3" data-txt="Công cụ xử lý hàng loạt" />
                                </div>
                                <div title="option-1">
                                    <input
                                        id="option-1-v3"
                                        name="option-v3"
                                        type="radio"
                                        value="deleteSelectedVouchers"
                                        checked={bulkAction === 'deleteSelectedVouchers'}
                                        onChange={(e) => {
                                            if (selectedVoucher.length > 0) {
                                                setBulkAction(e.target.value)
                                            }
                                        }}
                                    />
                                    <label className="option" htmlFor="option-1-v3" data-txt="Xóa các voucher đang chọn" />
                                </div>
                            </div>
                        </div>
                        <div className="select mx-3">
                            <div className="selected" data-default="Tất cả" data-one="Sắp diễn ra" data-two="Đang diễn ra" data-three="Đã kết thúc">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            </div>
                            <div className="options">
                                <div title="all">
                                    <input
                                        id="all"
                                        name="option"
                                        type="radio"
                                        defaultChecked
                                        value=""
                                        onChange={(e) => {
                                            handleFilterChange('status', e.target.value)
                                        }}
                                    />
                                    <label className="option" htmlFor="all" data-txt="Tất cả" />
                                </div>
                                <div title="option-1">
                                    <input
                                        id="option-1"
                                        name="option"
                                        type="radio"
                                        value="upcoming"
                                        onChange={(e) => {
                                            handleFilterChange('status', e.target.value)
                                        }}
                                    />
                                    <label className="option" htmlFor="option-1" data-txt="Sắp diễn ra" />
                                </div>
                                <div title="option-2">
                                    <input
                                        id="option-2"
                                        name="option"
                                        type="radio"
                                        value="ongoing"
                                        onChange={(e) => {
                                            handleFilterChange('status', e.target.value)
                                        }}
                                    />
                                    <label className="option" htmlFor="option-2" data-txt="Đang diễn ra" />
                                </div>
                                <div title="option-3">
                                    <input
                                        id="option-3"
                                        name="option"
                                        type="radio"
                                        value="ended"
                                        onChange={(e) => {
                                            handleFilterChange('status', e.target.value)
                                        }}
                                    />
                                    <label className="option" htmlFor="option-3" data-txt="Đã kết thúc" />
                                </div>
                            </div>
                        </div>
                        <button className="primary-btn shadow-none py-2 px-4 rounded-2 border-1" onClick={() => navigate('/seller/voucher/create')}>
                            <p className="fs-4 fw-medium">
                                Thêm voucher mới <span className="ms-2">+</span>
                            </p>
                        </button>
                    </div>
                </div>
                <div className="p-3">
                    <div className="border rounded-2 p-3">
                        <div className=" voucher-grid py-3 border-bottom">
                            <div className="checkbox-cell">
                                <label className="d-flex align-items-center">
                                    <input type="checkbox" className="input-checkbox" checked={selectedVoucher.length === filteredVouchers.length} onChange={handleSelectAllVoucher} />
                                    <span className="custom-checkbox"></span>
                                </label>
                            </div>
                            <p className="fs-4 fw-medium">Mã voucher</p>
                            <p className="fs-4 fw-medium text-center">Giảm giá</p>
                            <p className="fs-4 fw-medium text-center">Lượt sử dụng tối đa</p>
                            <p className="fs-4 fw-medium text-center">Đã sử dụng</p>
                            <p className="fs-4 fw-medium text-center">Trạng thái | Thời gian</p>
                            <div className="px-4"></div>
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
                        ) : filteredVouchers.length == 0 ? (
                            <p className="fs-3 fw-medium text-center">Không có voucher nào</p>
                        ) : (
                            filteredVouchers.map((voucher) => (
                                <div key={voucher._id} className="voucher-grid py-3 border-bottom">
                                    <div className="checkbox-cell">
                                        <label className="d-flex align-items-center">
                                            <input type="checkbox" className="input-checkbox" checked={selectedVoucher.includes(voucher._id)} onChange={() => handleSelectVoucher(voucher._id)} />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={
                                                voucher.voucherType === 'all' && voucher.discountType === 'percentage'
                                                    ? voucherImages[3]
                                                    : voucher.voucherType === 'all' && voucher.discountType === 'fixedamount'
                                                    ? voucherImages[2]
                                                    : voucher.voucherType === 'product' && voucher.discountType === 'percentage'
                                                    ? voucherImages[1]
                                                    : voucher.voucherType === 'product' && voucher.discountType === 'fixedamount'
                                                    ? voucherImages[0]
                                                    : null
                                            }
                                            alt=""
                                            style={{ width: '120px', height: '50px', objectFit: 'cover' }}
                                        />
                                        <p className="ms-3 fs-4 fw-medium">{voucher.code}</p>
                                    </div>
                                    <p className="fs-4 fw-medium text-center">
                                        {voucher.discountValue}
                                        {voucher.discountType === 'percentage' ? '%' : 'đ'}
                                    </p>
                                    <p className="fs-4 fw-medium text-center">{voucher.usageLimit}</p>
                                    <p className="fs-4 fw-medium text-center">{voucher.used}</p>
                                    <div>
                                        <p
                                            className={`text-center fw-medium ${
                                                new Date() >= new Date(voucher.validFrom) && new Date() <= new Date(voucher.validUntil)
                                                    ? 'text-success'
                                                    : new Date() > new Date(voucher.validUntil)
                                                    ? 'text-danger'
                                                    : 'text-warning'
                                            }`}
                                        >
                                            {(new Date() >= new Date(voucher.validFrom) && new Date() <= new Date(voucher.validUntil) && 'Đang diễn ra') ||
                                                (new Date() > new Date(voucher.validUntil) && 'Đã kết thúc') ||
                                                (new Date() < new Date(voucher.validFrom) && 'Sắp diễn ra')}
                                        </p>
                                        <p className="text-center fs-4 fw-medium">
                                            {new Date(voucher.validFrom).toLocaleDateString('vi-VN')} - {new Date(voucher.validUntil).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div className="d-flex align-items-center flex-column">
                                        <FontAwesomeIcon icon={faEye} className="fs-3 my-2 p-2 hover-icon" color="#000" />
                                        <FontAwesomeIcon icon={faPen} className="fs-3 p-2 hover-icon" color="#4a90e2" onClick={() => navigate(`/seller/voucher/edit/${voucher._id}`)} />
                                        <FontAwesomeIcon icon={faTrashCan} className="fs-3 my-2 p-2 hover-icon" color="#e74c3c" onClick={() => handleDeleteVoucher(voucher._id)} />
                                        {voucher.voucherType === 'product' && <FontAwesomeIcon icon={faShare} className="fs-3 p-2 hover-icon" color="#4a90e2" />}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {selectedVoucherIds.length > 0 && (
                <Modal show={selectedVoucherIds.length > 0} onHide={() => setSelectedVoucherIds([])} centered>
                    <Notification type="warning" title="Bạn có chắc chắn muốn xóa (các) voucher này?" description="Bạn sẽ không thể hoàn tác sau khi xóa">
                        <div className="d-flex align-items-center justify-content-center bg-white">
                            <button className=" border px-3 py-1 bg-white rounded-2" onClick={() => setSelectedVoucherIds([])}>
                                <p className="fs-4">Hủy</p>
                            </button>
                            <button className="primary-btn shadow-none py-1 px-3 ms-3" onClick={handleDeleteSelectedVouchers}>
                                <p className="fs-4">Xóa</p>
                            </button>
                        </div>
                    </Notification>
                </Modal>
            )}
            {showNotification && (
                <Modal show={showNotification} onHide={() => setShowNotification(false)} centered>
                    <Notification type={notificationType} title={notificationTitle} description={notificationMessage} />
                </Modal>
            )}
        </div>
    )
}

export default VoucherManagement
