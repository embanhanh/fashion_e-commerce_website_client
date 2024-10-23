import './DesignShop.scss'
import { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrashCan, faEye, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import banner from '../../assets/image/banner/banner1.png'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBanners, setFilters, deleteManyBanners, resetBannerState, fetchBannerById } from '../../redux/slices/bannerSlice'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'
import Notification from '../../components/Notification'
import Modal from 'react-bootstrap/Modal'

function DesignShop() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading, currentBanner, banners, filters, status, success, error } = useSelector((state) => state.banner)
    const [search, setSearch] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [statusFilter, setStatusFilter] = useState('')
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    const [notificationType, setNotificationType] = useState('')
    const [showViewBanner, setShowViewBanner] = useState(false)
    const [showConfirmDelete, setShowConfirmDelete] = useState({
        show: false,
        bannerId: [],
    })
    const [selectedBanners, setSelectedBanners] = useState([])
    const [bulkAction, setBulkAction] = useState('')

    useEffect(() => {
        dispatch(fetchBanners(filters))
    }, [dispatch, filters])

    const handleDeleteBanner = (bannerId) => {
        setShowConfirmDelete({ show: true, bannerId: [bannerId] })
    }

    const handleViewBanner = (bannerId) => {
        dispatch(fetchBannerById(bannerId))
        setShowViewBanner(true)
    }

    const handleSubmitFilters = () => {
        dispatch(setFilters({ search, startDate, endDate }))
    }

    const filteredBanners = useMemo(() => {
        return banners.filter((banner) => {
            const isMatchStatus =
                statusFilter === '' ||
                (statusFilter === 'active' && new Date(banner.displayStartTime) < new Date() && new Date(banner.displayEndTime) > new Date()) ||
                (statusFilter === 'expired' && new Date(banner.displayEndTime) < new Date()) ||
                (statusFilter === 'upcoming' && new Date(banner.displayStartTime) > new Date())
            return isMatchStatus
        })
    }, [banners, search, statusFilter])

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedBanners(filteredBanners.map((banner) => banner._id))
        } else {
            setSelectedBanners([])
        }
    }

    const handleSelectBanner = (bannerId) => {
        setSelectedBanners((prevSelected) => {
            if (prevSelected.includes(bannerId)) {
                return prevSelected.filter((id) => id !== bannerId)
            } else {
                return [...prevSelected, bannerId]
            }
        })
    }

    const handleBulkAction = () => {
        if (bulkAction === 'deleteSelectedBanners') {
            setShowConfirmDelete({ show: true, bannerId: selectedBanners })
        }
    }

    const handleDeleteSelectedBanners = async () => {
        if (showConfirmDelete.bannerId.length > 0) {
            await dispatch(deleteManyBanners(showConfirmDelete.bannerId))
            setShowConfirmDelete({ show: false, bannerId: [] })
            setSelectedBanners([])
            setBulkAction('')
        }
    }

    useEffect(() => {
        if (bulkAction === 'deleteSelectedBanners' && selectedBanners.length > 0) {
            handleBulkAction()
        }
    }, [bulkAction])

    useEffect(() => {
        if (success) {
            setNotificationMessage('Banner đã được xóa thành công!')
            setNotificationType('success')
            setShowNotification(true)
        } else if (error) {
            setNotificationMessage('Lỗi khi xóa banner: ' + error)
            setNotificationType('error')
            setShowNotification(true)
        }
    }, [success, error])

    return (
        <div className="pb-5">
            <div className="bg-white border">
                <p className="fs-3 fw-medium p-3 border-bottom">Thiết kế Banner</p>
                <div className="row p-3 g-4">
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium text-nowrap me-4 label-width text-center">Tiêu đề</p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" className="input-text w-100" placeholder="Tiêu đề Banner" />
                        </div>
                    </div>
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium text-nowrap me-4 label-width text-end">Ngày áp dụng</p>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            className="input-form fs-4 ps-3"
                            placeholderText="Chọn ngày bắt đầu"
                        />
                        <span className="mx-3 fs-2">-</span>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            className="input-form fs-4 ps-3"
                            placeholderText="Chọn ngày kết thúc"
                        />
                    </div>
                </div>
                <div className="d-flex p-3 justify-content-center align-items-center">
                    <button className="primary-btn shadow-none py-1 px-4 rounded-2 border-1" onClick={handleSubmitFilters}>
                        <p className="fs-4 fw-medium">Tìm</p>
                    </button>

                    <button
                        onClick={() => {
                            setSearch('')
                            setStartDate(null)
                            setEndDate(null)
                            dispatch(setFilters({ search: '', startDate: null, endDate: null }))
                        }}
                        className="ms-3 py-1 px-4 rounded-2 border bg-white"
                    >
                        <p className="fs-4 fw-medium">Đặt lại</p>
                    </button>
                </div>
            </div>
            <div className="bg-white border mt-3">
                <p className="fs-3 fw-medium p-3 border-bottom">Danh sách Banner</p>
                <div className="p-3 d-flex align-items-center justify-content-between">
                    <p className="fs-3 fw-medium">{filteredBanners.length} banner</p>
                    <div className="d-flex">
                        <div className="select ">
                            <div className="selected" data-default="Công cụ xử lý hàng loạt" data-one="Xóa các banner đang chọn">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            </div>
                            <div className="options">
                                <div title="all">
                                    <input id="all-v2" name="option-v2" type="radio" checked={bulkAction === ''} onChange={() => setBulkAction('')} />
                                    <label className="option" htmlFor="all-v2" data-txt="Công cụ xử lý hàng loạt" />
                                </div>
                                <div title="option-1">
                                    <input
                                        id="option-1-v2"
                                        name="option-v2"
                                        type="radio"
                                        value="deleteSelectedBanners"
                                        checked={bulkAction === 'deleteSelectedBanners'}
                                        onChange={(e) => {
                                            if (selectedBanners.length > 0) {
                                                setBulkAction(e.target.value)
                                            }
                                        }}
                                    />
                                    <label className="option" htmlFor="option-1-v2" data-txt="Xóa các banner đang chọn" />
                                </div>
                            </div>
                        </div>
                        <div className="select mx-3">
                            <div className="selected" data-default="Tất cả" data-one="Đang hoạt động" data-two="Đã hết hạn" data-three="Sắp diễn ra">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            </div>
                            <div className="options">
                                <div title="all">
                                    <input id="all" name="option" type="radio" defaultChecked value="" onChange={(e) => setStatusFilter(e.target.value)} />
                                    <label className="option" htmlFor="all" data-txt="Tất cả" />
                                </div>
                                <div title="option-1">
                                    <input id="option-1" name="option" type="radio" value="active" onChange={(e) => setStatusFilter(e.target.value)} />
                                    <label className="option" htmlFor="option-1" data-txt="Đang hoạt động" />
                                </div>
                                <div title="option-2">
                                    <input id="option-2" name="option" type="radio" value="expired" onChange={(e) => setStatusFilter(e.target.value)} />
                                    <label className="option" htmlFor="option-2" data-txt="Đã hết hạn" />
                                </div>
                                <div title="option-3">
                                    <input id="option-3" name="option" type="radio" value="upcoming" onChange={(e) => setStatusFilter(e.target.value)} />
                                    <label className="option" htmlFor="option-3" data-txt="Sắp diễn ra" />
                                </div>
                            </div>
                        </div>
                        <button className="primary-btn shadow-none py-2 px-4 rounded-2 border-1" onClick={() => navigate('/seller/shop/banner/create')}>
                            <p className="fs-4 fw-medium">
                                Tạo banner mới <span className="ms-2">+</span>
                            </p>
                        </button>
                    </div>
                </div>
                <div className="p-3">
                    <div className="border rounded-2 p-3">
                        <div className="banner-grid py-3 border-bottom">
                            <div className="checkbox-cell">
                                <label className="d-flex align-items-center">
                                    <input checked={selectedBanners.length === filteredBanners.length} type="checkbox" className="input-checkbox" onChange={handleSelectAll} />
                                    <span className="custom-checkbox"></span>
                                </label>
                            </div>
                            <p className="fs-4 fw-medium">Hình ảnh</p>
                            <p className="fs-4 fw-medium text-center">Tiêu đề</p>
                            <p className="fs-4 fw-medium text-center">Ngày áp dụng</p>
                            <p className="fs-4 fw-medium text-center">Ngày hết hạn</p>
                            <p className="fs-4 fw-medium text-center">Trạng thái</p>
                            <p className="px-4"></p>
                        </div>
                        {status === 'loading' ? (
                            <p>Đang tải...</p>
                        ) : status === 'failed' ? (
                            <p>Đã xảy ra lỗi khi tải dữ liệu</p>
                        ) : filteredBanners.length > 0 ? (
                            filteredBanners.map((banner) => (
                                <div key={banner._id} className="banner-grid py-3 border-bottom">
                                    <div className="checkbox-cell">
                                        <label className="d-flex align-items-center">
                                            <input type="checkbox" className="input-checkbox" checked={selectedBanners.includes(banner._id)} onChange={() => handleSelectBanner(banner._id)} />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                    </div>
                                    <div className="product-info">
                                        <img src={banner.imageUrl} alt="" className="product-image" style={{ width: '130px', height: '60px', objectFit: 'cover' }} />
                                    </div>
                                    <p className="fs-4 fw-medium text-center">{banner.title}</p>
                                    <p className="fs-4 fw-medium text-center">{new Date(banner.displayStartTime).toLocaleDateString()}</p>
                                    <p className="fs-4 fw-medium text-center">{new Date(banner.displayEndTime).toLocaleDateString()}</p>
                                    <p className="fs-4 fw-medium text-center">{banner.isActive ? 'Đang hoạt động' : 'Đã hết hạn'}</p>
                                    <div className="d-flex align-items-center flex-column">
                                        <FontAwesomeIcon icon={faEye} className="fs-3 my-2 p-2 hover-icon" color="#000" onClick={() => handleViewBanner(banner._id)} />
                                        <FontAwesomeIcon icon={faPen} className="fs-3 p-2 hover-icon" color="#4a90e2" onClick={() => navigate(`/seller/shop/banner/edit/${banner._id}`)} />
                                        <FontAwesomeIcon icon={faTrashCan} className="fs-3 my-2 p-2 hover-icon" color="#e74c3c" onClick={() => handleDeleteBanner(banner._id)} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không tìm thấy banner nào</p>
                        )}
                    </div>
                </div>
            </div>
            {showNotification && (
                <Modal
                    show={showNotification}
                    onHide={() => {
                        setShowNotification(false)
                        dispatch(resetBannerState())
                    }}
                    centered
                >
                    <Notification type={notificationType} title={notificationType === 'success' ? 'Thành công' : 'Lỗi'} description={notificationMessage} />
                </Modal>
            )}
            {showViewBanner && (
                <Modal show={showViewBanner} onHide={() => setShowViewBanner(false)} centered className="view-banner-modal d-flex align-items-center justify-content-center">
                    {loading ? (
                        <div className="dot-spinner ms-4">
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center justify-content-center position-relative" style={{ height: '500px', width: '1000px' }}>
                            <img src={currentBanner.imageUrl} alt="" className="product-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {currentBanner.elements.button && (
                                <button
                                    style={{ position: 'absolute', top: `${currentBanner.elements.button.top}%`, left: `${currentBanner.elements.button.left}%` }}
                                    className="primary-btn py-2 px-5"
                                >
                                    <p className="fs-2 fw-medium">
                                        {currentBanner.buttonText} <FontAwesomeIcon icon={faArrowRight} />
                                    </p>
                                </button>
                            )}
                            {currentBanner.elements.title && (
                                <h2
                                    className="text-white fw-bold"
                                    style={{
                                        padding: 8,
                                        fontSize: '3.8rem',
                                        maxWidth: '450px',
                                        textShadow: '4px 4px 8px rgba(0, 0, 0, 0.7)',
                                        position: 'absolute',
                                        top: `${currentBanner.elements.title.top}%`,
                                        left: `${currentBanner.elements.title.left}%`,
                                    }}
                                >
                                    {currentBanner.title}
                                </h2>
                            )}
                            {currentBanner.elements.description && (
                                <p
                                    className="text-white fw-medium"
                                    style={{
                                        fontSize: '2.2rem',
                                        padding: 8,
                                        maxWidth: '450px',
                                        textShadow: '4px 4px 8px rgba(0, 0, 0, 0.7)',
                                        position: 'absolute',
                                        top: `${currentBanner.elements.description.top}%`,
                                        left: `${currentBanner.elements.description.left}%`,
                                    }}
                                >
                                    {currentBanner.description}
                                </p>
                            )}
                        </div>
                    )}
                </Modal>
            )}
            {showConfirmDelete.show && (
                <Modal show={showConfirmDelete.show} onHide={() => setShowConfirmDelete({ show: false, bannerId: [] })} centered>
                    <Notification type="warning" title="Bạn có chắc chắn muốn xóa (các) banner này?" description="Bạn sẽ không thể hoàn tác sau khi xóa">
                        <div className="d-flex align-items-center justify-content-center bg-white">
                            <button className=" border px-3 py-1 bg-white rounded-2" onClick={() => setShowConfirmDelete({ show: false, bannerId: [] })}>
                                <p className="fs-4">Hủy</p>
                            </button>
                            <button className="primary-btn shadow-none py-1 px-3 ms-3" onClick={handleDeleteSelectedBanners}>
                                <p className="fs-4">Xóa</p>
                            </button>
                        </div>
                    </Notification>
                </Modal>
            )}
        </div>
    )
}

export default DesignShop
