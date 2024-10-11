import './DesignShop.scss'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrashCan, faEye } from '@fortawesome/free-solid-svg-icons'
import banner from '../../assets/image/banner/banner1.png'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBanners, setFilters, deleteBanner } from '../../redux/slices/bannerSlice'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'

function DesignShop() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { banners, filters, status } = useSelector((state) => state.banner)
    const [search, setSearch] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    useEffect(() => {
        dispatch(fetchBanners(filters))
    }, [dispatch, filters])

    const handleDeleteBanner = (bannerId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
            dispatch(deleteBanner(bannerId))
        }
    }

    const handleSubmitFilters = () => {
        dispatch(setFilters({ search, startDate, endDate }))
    }

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
                    <p className="fs-3 fw-medium">20 banner</p>
                    <div className="d-flex">
                        <button className="primary-btn shadow-none py-2 px-4 rounded-2 border-1">
                            <p className="fs-4 fw-medium">
                                Tạo banner mới <span className="ms-2">+</span>
                            </p>
                        </button>
                        <div className="select ms-3">
                            <div className="selected" data-default="Tất cả" data-one="Đang hoạt động" data-two="Đã hết hạn">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            </div>
                            <div className="options">
                                <div title="all">
                                    <input id="all" name="option" type="radio" defaultChecked value="" />
                                    <label className="option" htmlFor="all" data-txt="Tất cả" />
                                </div>
                                <div title="option-1">
                                    <input id="option-1" name="option" type="radio" value="active" />
                                    <label className="option" htmlFor="option-1" data-txt="Đang hoạt động" />
                                </div>
                                <div title="option-2">
                                    <input id="option-2" name="option" type="radio" value="expired" />
                                    <label className="option" htmlFor="option-2" data-txt="Đã hết hạn" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-3">
                    <div className="border rounded-2 p-3">
                        <div className="banner-grid py-3 border-bottom">
                            <div className="checkbox-cell">
                                <label className="d-flex align-items-center">
                                    <input type="checkbox" className="input-checkbox" />
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
                        ) : banners.length > 0 ? (
                            banners.map((banner) => (
                                <div key={banner._id} className="banner-grid py-3 border-bottom">
                                    <div className="checkbox-cell">
                                        <label className="d-flex align-items-center">
                                            <input type="checkbox" className="input-checkbox" />
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
                                        <FontAwesomeIcon icon={faEye} className="fs-3 my-2 p-2 hover-icon" color="#000" />
                                        <FontAwesomeIcon icon={faPen} className="fs-3 p-2 hover-icon" color="#4a90e2" onClick={() => navigate(`/seller/banners/edit/${banner._id}`)} />
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
        </div>
    )
}

export default DesignShop
