import { vi } from 'date-fns/locale'
import React, { useEffect, useState, useRef, useLayoutEffect, useCallback, useMemo } from 'react'
import { DndProvider, useDrag, useDrop, useDragLayer } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useDropzone } from 'react-dropzone'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-bootstrap/Modal'
import { useParams, useNavigate } from 'react-router-dom'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { createBannerAction, resetBannerState, fetchBannerById, updateBanner } from '../../redux/slices/bannerSlice'
import { fetchCategories } from '../../redux/slices/categorySlice'
import { storage } from '../../firebase.config'
import DraggableBox from '../../components/DraggableBox'
import './CreateBanner.scss'

function CreateBanner() {
    const { banner_id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentBanner, loading, error, success } = useSelector((state) => state.banner)
    const { categories } = useSelector((state) => state.category)
    const [showNotification, setShowNotification] = useState(false)
    const [notificationTitle, setNotificationTitle] = useState('')
    const [notificationMessage, setNotificationMessage] = useState('')
    const [notificationType, setNotificationType] = useState('')
    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [bannerInfo, setBannerInfo] = useState({
        imageUrl: '',
        title: '',
        description: '',
        buttonText: '',
        linkUrl: '',
        displayStartTime: new Date(),
        displayEndTime: new Date(),
    })
    const [previewImage, setPreviewImage] = useState(null)
    const [errors, setErrors] = useState({
        title: '',
        description: '',
        buttonText: '',
        imageUrl: '',
        linkUrl: '',
        displayStartTime: '',
        displayEndTime: '',
    })
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef(null)
    const suggestionsRef = useRef(null)

    useEffect(() => {
        if (banner_id) {
            dispatch(fetchBannerById(banner_id))
        }
    }, [banner_id])

    useEffect(() => {
        if (currentBanner && banner_id) {
            setBannerInfo({
                imageUrl: currentBanner.imageUrl,
                title: currentBanner.title,
                description: currentBanner.description,
                buttonText: currentBanner.buttonText,
                linkUrl: currentBanner.linkUrl,
                displayStartTime: new Date(currentBanner.displayStartTime),
                displayEndTime: new Date(currentBanner.displayEndTime),
            })
        }
    }, [currentBanner, banner_id])

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategories())
        }
    }, [categories])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(e.target) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(e.target)
            ) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const validateForm = () => {
        let tempErrors = {}
        let isValid = true

        // Validate title
        if (!bannerInfo.title.trim()) {
            tempErrors.title = 'Vui lòng nhập tiêu đề'
            isValid = false
        }

        // Validate description
        if (!bannerInfo.description.trim()) {
            tempErrors.description = 'Vui lòng nhập mô tả'
            isValid = false
        }

        // Validate button text
        if (!bannerInfo.buttonText.trim()) {
            tempErrors.buttonText = 'Vui lòng nhập tiêu đề nút'
            isValid = false
        }

        // Validate image
        if (!file && !bannerInfo.imageUrl) {
            tempErrors.imageUrl = 'Vui lòng chọn ảnh banner'
            isValid = false
        }

        // Validate link URL
        if (!bannerInfo.linkUrl.trim()) {
            tempErrors.linkUrl = 'Vui lòng nhập đường dẫn'
            isValid = false
        }

        // Validate dates
        if (!bannerInfo.displayStartTime) {
            tempErrors.displayStartTime = 'Vui lòng chọn ngày bắt đầu'
            isValid = false
        }
        if (!bannerInfo.displayEndTime) {
            tempErrors.displayEndTime = 'Vui lòng chọn ngày kết thúc'
            isValid = false
        }
        if (bannerInfo.displayStartTime && bannerInfo.displayEndTime) {
            if (bannerInfo.displayEndTime < bannerInfo.displayStartTime) {
                tempErrors.displayEndTime = 'Ngày kết thúc phải sau ngày bắt đầu'
                isValid = false
            }
        }

        setErrors(tempErrors)
        return isValid
    }

    const handleSave = async () => {
        if (!validateForm()) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Vui lòng kiểm tra lại thông tin',
                icon: 'error',
                confirmButtonText: 'OK',
            })
            return
        }

        try {
            setIsLoading(true)
            let downloadURL = bannerInfo.imageUrl
            if (file) {
                const storageRef = ref(storage, `banners/${Date.now()}_${file.name}`)
                const snapshot = await uploadBytes(storageRef, file)
                downloadURL = await getDownloadURL(snapshot.ref)
            }

            const bannerData = {
                ...bannerInfo,
                imageUrl: downloadURL,
            }

            if (banner_id) {
                Swal.fire({
                    title: 'Xác nhận',
                    text: 'Bạn có chắc chắn muốn cập nhật banner?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Xác nhận',
                    cancelButtonText: 'Hủy',
                    reverseButtons: true,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await dispatch(updateBanner({ bannerId: banner_id, bannerData })).unwrap()
                        Swal.fire({
                            title: 'Thành công',
                            text: 'Cập nhật banner thành công',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        }).then(() => {
                            setBannerInfo({
                                imageUrl: '',
                                title: '',
                                description: '',
                                buttonText: '',
                                linkUrl: '',
                                displayStartTime: new Date(),
                                displayEndTime: new Date(),
                            })
                            setFile(null)
                            setPreviewImage(null)
                        })
                    }
                })
            } else {
                Swal.fire({
                    title: 'Xác nhận',
                    text: 'Bạn có chắc chắn muốn tạo banner?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Xác nhận',
                    cancelButtonText: 'Hủy',
                    reverseButtons: true,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await dispatch(createBannerAction(bannerData)).unwrap()
                        Swal.fire({
                            title: 'Thành công',
                            text: 'Tạo banner thành công',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        }).then(() => {
                            setBannerInfo({
                                imageUrl: '',
                                title: '',
                                description: '',
                                buttonText: '',
                                linkUrl: '',
                                displayStartTime: new Date(),
                                displayEndTime: new Date(),
                            })
                            setFile(null)
                            setPreviewImage(null)
                        })
                    }
                })
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi',
                text: `Có lỗi xảy ra, ${error}`,
                icon: 'error',
                confirmButtonText: 'OK',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0]

        if (!selectedFile.type.startsWith('image/')) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Vui lòng chọn file ảnh',
                icon: 'error',
                confirmButtonText: 'OK',
            })
            return
        }

        // Tạo preview URL
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreviewImage(objectUrl)
        setFile(selectedFile)

        // Reset input
        e.target.value = ''
    }

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage)
            }
        }
    }, [previewImage])

    return (
        <div className="d-flex flex-column gap-4 align-items-center pb-5 px-4">
            <div className="bg-white rounded-4 shadow-sm create-banner-container">
                <p className="fs-3 fw-medium p-3 border-bottom">Tạo banner</p>
                <div className="p-4 d-flex flex-column gap-4">
                    <div className="d-flex gap-4">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Tiêu đề:
                        </p>
                        <div className={`input-form d-flex align-items-center w-100`}>
                            <input
                                value={bannerInfo.title}
                                type="text"
                                className="input-text w-100"
                                placeholder="Tiêu đề"
                                onChange={(e) => setBannerInfo({ ...bannerInfo, title: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="d-flex gap-4">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Mô tả:
                        </p>
                        <div className={`input-form d-flex align-items-center w-100 h-100`}>
                            <textarea
                                cols={4}
                                value={bannerInfo.description}
                                className="input-text w-100 h-auto"
                                placeholder="Mô tả"
                                onChange={(e) => setBannerInfo({ ...bannerInfo, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="d-flex gap-4">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Tiêu đề nút:
                        </p>
                        <div className={`input-form d-flex align-items-center w-100`}>
                            <input
                                value={bannerInfo.buttonText}
                                type="text"
                                className="input-text w-100"
                                placeholder="Tiêu đề"
                                onChange={(e) => setBannerInfo({ ...bannerInfo, buttonText: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="d-flex gap-4">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Hình ảnh:
                        </p>
                        <div className="w-100">
                            {previewImage || bannerInfo.imageUrl ? (
                                <>
                                    <div className="preview-image__banner-container">
                                        <img
                                            src={previewImage || bannerInfo.imageUrl}
                                            alt="Preview"
                                            className="preview-image__banner"
                                        />
                                        <button
                                            className="remove-image__banner-btn"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setPreviewImage(null)
                                                setFile(null)
                                                setBannerInfo({ ...bannerInfo, imageUrl: '' })
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCircleXmark} size="2xl" color="white" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <label className="custum-file-upload custom-file-upload__banner">
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
                                    <div className="text">
                                        <span>Thêm hình ảnh</span>
                                    </div>
                                    <input
                                        type="file"
                                        id="main-product-images"
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                    <div className="d-flex gap-4">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Link:
                        </p>
                        <div
                            className={`input-form d-flex align-items-center w-100 position-relative suggestion-categories-container__banner ${
                                showSuggestions ? 'show-suggestions' : ''
                            }`}
                        >
                            <input
                                ref={inputRef}
                                value={bannerInfo.linkUrl}
                                type="text"
                                className="input-text w-100"
                                placeholder="Link"
                                onChange={(e) => setBannerInfo({ ...bannerInfo, linkUrl: e.target.value })}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            <div
                                ref={suggestionsRef}
                                className={`position-absolute suggestion-categories__banner scrollbar-y shadow ${
                                    showSuggestions ? 'd-block' : 'd-none'
                                }`}
                            >
                                {categories
                                    .filter((category) => category.parentCategory === null)
                                    .map((category) => (
                                        <div
                                            className="suggestion-categories__banner-item"
                                            key={category._id}
                                            onClick={() => {
                                                setBannerInfo((prev) => ({
                                                    ...prev,
                                                    linkUrl: `/products?category=${category.slug}&page=1`,
                                                }))
                                                setShowSuggestions(false)
                                            }}
                                        >
                                            <p>{category.name}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-4 align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Thời gian hiển thị:
                        </p>
                        <div className="w-100 d-flex align-items-center">
                            <DatePicker
                                selectsStart
                                className="input-form fs-4 ps-3"
                                placeholderText="Chọn ngày bắt đầu"
                                selected={bannerInfo.displayStartTime}
                                onChange={(date) => setBannerInfo({ ...bannerInfo, displayStartTime: date })}
                                startDate={bannerInfo.displayStartTime}
                                endDate={bannerInfo.displayEndTime}
                                locale={vi}
                                dateFormat="dd/MM/yyyy"
                            />
                            <span className="fs-4 mx-3">-</span>
                            <DatePicker
                                selectsEnd
                                className="input-form fs-4 ps-3"
                                placeholderText="Chọn ngày kết thúc"
                                selected={bannerInfo.displayEndTime}
                                onChange={(date) => setBannerInfo({ ...bannerInfo, displayEndTime: date })}
                                startDate={bannerInfo.displayStartTime}
                                endDate={bannerInfo.displayEndTime}
                                minDate={bannerInfo.displayStartTime}
                                locale={vi}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex gap-4 align-items-center justify-content-center">
                <button className="border px-4 py-2 bg-white rounded-4" onClick={() => navigate(-1)}>
                    <p>Hủy</p>
                </button>
                <button className="px-4 py-2 rounded-4 primary-btn" disabled={isLoading} onClick={handleSave}>
                    <p>{banner_id ? 'Cập nhật' : 'Tạo'}</p>
                    {isLoading && (
                        <div className="dot-spinner ms-4">
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                        </div>
                    )}
                </button>
            </div>
            {showNotification && (
                <Modal show={showNotification} onHide={() => setShowNotification(false)} centered>
                    <Notification title={notificationTitle} description={notificationMessage} type={notificationType} />
                </Modal>
            )}
        </div>
    )
}

export default CreateBanner
