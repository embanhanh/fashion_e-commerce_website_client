import './PromotionalCombos.scss'
import DatePicker from 'react-datepicker'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCircleInfo, faTrash } from '@fortawesome/free-solid-svg-icons'
import { getPromotionalCombosAction, deleteManyPromotionalCombosAction, getPromotionalComboByIdAction } from '../../redux/slices/promotionalComboSlice'
import Modal from 'react-bootstrap/Modal'
import Notification from '../../components/Notification'

function PromotionalCombos() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { promotionalCombos, promotionalCombo, status } = useSelector((state) => state.promotionalCombo)

    const [filteredPromotionalCombos, setFilteredPromotionalCombos] = useState([])
    const [filter, setFilter] = useState({
        name: '',
        startDate: null,
        endDate: null,
        status: '',
    })
    const [selectedCombos, setSelectedCombos] = useState([])
    const [selectedComboIds, setSelectedComboIds] = useState([])
    const [showDetailCombo, setShowDetailCombo] = useState(false)
    const [comboVoucherId, setComboVoucherId] = useState(null)
    const [bulkAction, setBulkAction] = useState('')
    const [notification, setNotification] = useState({
        show: false,
        type: '',
        title: '',
        description: '',
    })

    const handleConfirmFilters = () => {
        setFilteredPromotionalCombos(
            promotionalCombos.filter((combo) => {
                return (
                    (filter.status === '' ||
                        (filter.status === 'upcoming' && new Date(combo.startDate) > new Date()) ||
                        (filter.status === 'ongoing' && new Date(combo.startDate) <= new Date() && new Date(combo.endDate) >= new Date()) ||
                        (filter.status === 'ended' && new Date(combo.endDate) < new Date())) &&
                    combo.name.toLowerCase().trim().includes(filter.name.toLowerCase().trim()) &&
                    (filter.startDate === null || new Date(combo.startDate) >= new Date(filter.startDate)) &&
                    (filter.endDate === null || new Date(combo.endDate) <= new Date(filter.endDate))
                )
            })
        )
    }

    const handleSelectCombo = (e, comboId) => {
        if (e.target.checked) {
            setSelectedCombos([...selectedCombos, comboId])
        } else {
            setSelectedCombos(selectedCombos.filter((id) => id !== comboId))
        }
    }

    const handleSelectAllCombos = (e) => {
        if (e.target.checked) {
            setSelectedCombos(filteredPromotionalCombos.map((combo) => combo._id))
        } else {
            setSelectedCombos([])
        }
    }

    const handleDeleteSelectedCombos = async () => {
        if (selectedComboIds.length > 0) {
            try {
                await dispatch(deleteManyPromotionalCombosAction(selectedComboIds)).unwrap()
                setSelectedComboIds([])
                setSelectedCombos([])
                setNotification({
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    description: 'Xóa combo thành công',
                })
                setBulkAction('')
            } catch (error) {
                setNotification({
                    show: true,
                    type: 'error',
                    title: 'Thất bại',
                    description: 'Xóa combo thất bại: ' + error.message,
                })
            }
        }
    }

    const handleShowDetailCombo = (id) => {
        setComboVoucherId(id)
        setShowDetailCombo(true)
    }

    const handleCloseCombo = () => {
        setComboVoucherId(null)
        setShowDetailCombo(false)
    }

    const fetchComboVoucherById = async (combo_id) => {
        try {
            await dispatch(getPromotionalComboByIdAction(combo_id))
        } catch (error) {
            console.error('Error fetching combo voucher:', error)
        }
    }

    useEffect(() => {
        if (comboVoucherId) {
            fetchComboVoucherById(comboVoucherId)
        }
    }, [comboVoucherId])


    useEffect(() => {
        if (comboVoucherId) {
            fetchComboVoucherById(comboVoucherId)
        }
    }, [comboVoucherId])

    useEffect(() => {
        dispatch(getPromotionalCombosAction())
    }, [dispatch])

    useEffect(() => {
        setFilteredPromotionalCombos(promotionalCombos)
    }, [dispatch, promotionalCombos])

    useEffect(() => {
        handleConfirmFilters()
    }, [filter.status])

    useEffect(() => {
        if (bulkAction === 'deleteSelectedCombos') {
            setSelectedComboIds(selectedCombos)
        }
    }, [bulkAction])

    return (
        <div className=" pb-5">
            <div className="bg-white border">
                <p className="fs-3 fw-medium p-3 border-bottom">Combo khuyến mãi</p>
                <div className="row p-3 g-4">
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium text-nowrap me-4 label-width text-end">Tên combo</p>
                        <div className="input-form d-flex align-items-center w-100">
                            <input type="text" value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })} className="input-text w-100" placeholder="Tên combo" />
                        </div>
                    </div>
                    <div className="col-6 d-flex align-items-center">
                        <p className="fs-4 fw-medium text-nowrap me-4 label-width ">Thời gian khuyến mãi</p>
                        <DatePicker
                            selected={filter.startDate}
                            onChange={(date) => setFilter({ ...filter, startDate: date })}
                            selectsStart
                            startDate={filter.startDate}
                            endDate={filter.endDate}
                            className="input-form fs-4 ps-3"
                            placeholderText="Chọn ngày bắt đầu"
                        />
                        <span className="mx-3 fs-2">-</span>
                        <DatePicker
                            selected={filter.endDate}
                            onChange={(date) => setFilter({ ...filter, endDate: date })}
                            selectsEnd
                            startDate={filter.startDate}
                            endDate={filter.endDate}
                            minDate={filter.startDate}
                            className="input-form fs-4 ps-3"
                            placeholderText="Chọn ngày kết thúc"
                        />
                    </div>
                </div>
                <div className="d-flex p-3 justify-content-center align-items-center">
                    <button className="primary-btn shadow-none py-1 px-4 rounded-2 border-1" onClick={handleConfirmFilters}>
                        <p className="fs-4 fw-medium">Tìm</p>
                    </button>

                    <button className="ms-3 py-1 px-4 rounded-2 border bg-white" onClick={() => setFilter({ name: '', startDate: null, endDate: null, status: '' })}>
                        <p className="fs-4 fw-medium">Nhập lại</p>
                    </button>
                </div>
            </div>
            <div className="bg-white border mt-3">
                <p className="fs-3 fw-medium p-3 border-bottom">Danh sách combo</p>
                <div className="p-3 d-flex align-items-center justify-content-between">
                    <p className="fs-3 fw-medium">0 combo</p>
                    <div className="d-flex align-items-center">
                        <div className="select ">
                            <div className="selected" data-default="Công cụ xử lý hàng loạt" data-one="Xóa các combo đang chọn">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            </div>
                            <div className="options">
                                <div title="all">
                                    <input id="all-v3" name="option-v3" type="radio" value="" checked={bulkAction === ''} onChange={(e) => setBulkAction(e.target.value)} />
                                    <label className="option" htmlFor="all-v3" data-txt="Công cụ xử lý hàng loạt" />
                                </div>
                                <div title="option-1">
                                    <input
                                        id="option-1-v3"
                                        name="option-v3"
                                        type="radio"
                                        value="deleteSelectedCombos"
                                        checked={bulkAction === 'deleteSelectedCombos'}
                                        onChange={(e) => {
                                            if (selectedCombos.length > 0) {
                                                setBulkAction(e.target.value)
                                            }
                                        }}
                                    />
                                    <label className="option" htmlFor="option-1-v3" data-txt="Xóa các combo đang chọn" />
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
                                    <input id="all" name="option" type="radio" defaultChecked value="" onChange={(e) => setFilter({ ...filter, status: '' })} />
                                    <label className="option" htmlFor="all" data-txt="Tất cả" />
                                </div>
                                <div title="option-1">
                                    <input id="option-1" name="option" type="radio" value="upcoming" onChange={(e) => setFilter({ ...filter, status: 'upcoming' })} />
                                    <label className="option" htmlFor="option-1" data-txt="Sắp diễn ra" />
                                </div>
                                <div title="option-2">
                                    <input id="option-2" name="option" type="radio" value="ongoing" onChange={(e) => setFilter({ ...filter, status: 'ongoing' })} />
                                    <label className="option" htmlFor="option-2" data-txt="Đang diễn ra" />
                                </div>
                                <div title="option-3">
                                    <input id="option-3" name="option" type="radio" value="ended" onChange={(e) => setFilter({ ...filter, status: 'ended' })} />
                                    <label className="option" htmlFor="option-3" data-txt="Đã kết thúc" />
                                </div>
                            </div>
                        </div>
                        <button className="primary-btn shadow-none py-2 px-4 rounded-2 border-1" onClick={() => navigate('/seller/combo/create')}>
                            <p className="fs-4 fw-medium">
                                Thêm combo mới <span className="ms-2">+</span>
                            </p>
                        </button>
                    </div>
                </div>
                <div className="p-3">
                    <div className="border rounded-2 p-3">
                        <div className="combo-grid py-3 border-bottom">
                            <div className="checkbox-cell">
                                <label className="d-flex align-items-center">
                                    <input type="checkbox" className="input-checkbox" checked={selectedCombos.length === filteredPromotionalCombos.length} onChange={handleSelectAllCombos} />
                                    <span className="custom-checkbox"></span>
                                </label>
                            </div>
                            <p className="fs-4 fw-medium">Tên combo</p>
                            <p className="fs-4 fw-medium text-center">Loại combo</p>
                            <p className="fs-4 fw-medium text-center">Sản phẩm</p>
                            <p className="fs-4 fw-medium text-center">Trạng thái</p>
                            <p className="fs-4 fw-medium text-center">Thời gian</p>
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
                            // <p>{error}</p>
                            <p>{notification.title}</p>
                        ) : filteredPromotionalCombos.length == 0 ? (
                            <p className="fs-3 fw-medium text-center">Không có combo nào</p>
                        ) : (
                            filteredPromotionalCombos.map((combo) => (
                                <div key={combo._id} className="combo-grid py-3 border-bottom">
                                    <div className="checkbox-cell">
                                        <label className="d-flex align-items-center">
                                            <input type="checkbox" className="input-checkbox" checked={selectedCombos.includes(combo._id)} onChange={(e) => handleSelectCombo(e, combo._id)} />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                    </div>
                                    <p className="fs-4 fw-medium">{combo.name}</p>
                                    <div className="">
                                        {combo.discountCombos.map((discount) => (
                                            <p key={discount._id} className="fs-4 fw-medium">
                                                Mua {discount.quantity} sản phẩm để được giảm {discount.discountValue}
                                                {combo.comboType === 'percentage' ? '%' : 'đ'}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="overflow-y-auto" style={{ maxHeight: '150px' }}>
                                        {combo.products.map((product) => (
                                            <div key={product._id} className="d-flex align-items-center my-2">
                                                <img src={product.urlImage} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                <p className="ms-2 product-name fw-medium" style={{ textOverflow: 'ellipsis', maxWidth: '100%' }}>
                                                    {product.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <p
                                        className={`fs-4 fw-medium text-center ${new Date() >= new Date(combo.startDate) && new Date() <= new Date(combo.endDate)
                                            ? 'text-success'
                                            : new Date() > new Date(combo.endDate)
                                                ? 'text-danger'
                                                : 'text-warning'
                                            }`}
                                    >
                                        {(new Date() >= new Date(combo.startDate) && new Date() <= new Date(combo.endDate) && 'Đang diễn ra') ||
                                            (new Date() > new Date(combo.endDate) && 'Đã kết thúc') ||
                                            (new Date() < new Date(combo.startDate) && 'Sắp diễn ra')}
                                    </p>
                                    <p className="fs-4 fw-medium text-center">
                                        {new Date(combo.startDate).toLocaleDateString('vi-VN')} - {new Date(combo.endDate).toLocaleDateString('vi-VN')}
                                    </p>
                                    <div className="d-flex align-items-center flex-column">
                                        <FontAwesomeIcon icon={faPen} className="fs-3 my-2 p-2 hover-icon" color="#4a90e2" onClick={() => navigate(`/seller/combo/edit/${combo._id}`)} />
                                        <FontAwesomeIcon icon={faCircleInfo} className="fs-3 my-2 p-2 hover-icon" color="#000" onClick={() => handleShowDetailCombo(combo._id)} />
                                        <FontAwesomeIcon icon={faTrash} className="fs-3 my-2 p-2 hover-icon text-danger" onClick={() => setSelectedComboIds([combo._id])} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {selectedComboIds.length > 0 && (
                <Modal show={selectedComboIds.length > 0} onHide={() => setSelectedComboIds([])} centered>
                    <Notification type="warning" title="Bạn có chắc chắn muốn xóa (các) combo này?" description="Bạn sẽ không thể hoàn tác sau khi xóa">
                        <div className="d-flex align-items-center justify-content-center bg-white">
                            <button className=" border px-3 py-1 bg-white rounded-2" onClick={() => setSelectedComboIds([])}>
                                <p className="fs-4">Hủy</p>
                            </button>
                            <button className="primary-btn shadow-none py-1 px-3 ms-3" onClick={handleDeleteSelectedCombos}>
                                <p className="fs-4">Xóa</p>
                            </button>
                        </div>
                    </Notification>
                </Modal>
            )}
            {notification.show && (
                <Modal show={notification.show} onHide={() => setNotification({ ...notification, show: false })} centered>
                    <Notification type={notification.type} title={notification.title} description={notification.description} />
                </Modal>
            )}
            {showDetailCombo && (
                <Modal show={showDetailCombo} onHide={handleCloseCombo} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="fs-2 fw-bold text-dark">Chi tiết combo voucher giảm giá</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {status === 'loading' ? (
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : promotionalCombo ? (
                            <div className="voucher-details p-3 border rounded overflow-y-auto" style={{ maxHeight: '500px' }}>
                                <div className="d-flex justify-content-between mb-3 fs-4">
                                    <strong>Tên combo voucher:</strong>
                                    <span className="fs-4 fw-normal">{promotionalCombo.name}</span>
                                </div>
                                <div className="">
                                    <div className="overflow-y-auto" style={{ maxHeight: '150px' }}>
                                        <strong className="fs-4 mb-3">Danh sách sản phẩm: </strong>
                                        {promotionalCombo.products?.map((product) => (
                                            <div key={product._id} className="d-flex flex-column my-2 ms-4">
                                                <div className="d-flex align-items-center">
                                                    <img src={product.urlImage[0]} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                    <p className="fs-4 fw-medium overflow-hidden text-nowrap ms-2" style={{ textOverflow: 'ellipsis', maxWidth: '100%' }}>
                                                        {product.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between my-2 fs-4">
                                    <strong>Giới hạn sử dụng combo cho 1 đơn hàng:</strong>
                                    <span>{promotionalCombo.limitCombo}</span>
                                </div>
                                <div className="d-flex flex-column justify-content-start mb-3 fs-4">
                                    <strong>Chi tiết giảm giá:</strong>
                                    <div className="ms-4">
                                        {promotionalCombo.discountCombos.map((discount) => (
                                            <p key={discount._id} className="fs-4 fw-medium">
                                                Mua {discount.quantity} sản phẩm để được giảm {discount.discountValue}
                                                {promotionalCombo.comboType === 'percentage' ? '%' : 'đ'}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between mb-3 fs-4">
                                    <strong>Ngày bắt đầu:</strong>
                                    <span>{new Date(promotionalCombo.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="d-flex justify-content-between fs-4">
                                    <strong>Ngày hết hạn:</strong>
                                    <span>{new Date(promotionalCombo.endDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ) : (
                            <section className="dots-container mt-4">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </section>
                        )}
                        {console.log(promotionalCombo)}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="primary-btn px-4 py-2 shadow-none light border rounded-3" variant="secondary" onClick={handleCloseCombo}>
                            <p>Đóng</p>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    )
}

export default PromotionalCombos
