import React, { useEffect, useState, useRef, useLayoutEffect, useCallback, useMemo } from 'react'
import { DndProvider, useDrag, useDrop, useDragLayer } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useDropzone } from 'react-dropzone'
import html2canvas from 'html2canvas'
import { useDispatch, useSelector } from 'react-redux'
import { createBannerAction, resetBannerState, fetchBannerById, updateBanner } from '../../redux/slices/bannerSlice'
import Notification from '../../components/Notification'
import { storage } from '../../firebase.config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import imageCompression from 'browser-image-compression'
import './CreateBanner.scss'
import banner1 from '../../assets/image/banner/banner1.png'
import banner2 from '../../assets/image/banner/banner2.png'
import DraggableBox from '../../components/DraggableBox'
import Modal from 'react-bootstrap/Modal'
import { useParams, useNavigate } from 'react-router-dom'

const DraggableElement = React.memo(({ id, children, position }) => {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: 'element',
            item: { id, ...position },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [id, position]
    )

    return (
        <div
            ref={drag}
            style={{
                position: 'absolute',
                top: `${position.top}%`,
                left: `${position.left}%`,
                // transform: `translate(${position.left}%, ${position.top}%)`,
                opacity: isDragging ? 0.5 : 1,
                // border: isDragging ? '1px solid #fff' : 'none',
                cursor: 'move',
                userSelect: 'none',
            }}
            className="draggable-elements-container"
        >
            {children}
        </div>
    )
})

const DropArea = React.memo(({ children, onMove, onRemove, backgroundImage }) => {
    const dropAreaRef = useRef(null)
    const [, drop] = useDrop({
        accept: 'element',
        drop: (item, monitor) => {
            const clientOffset = monitor.getSourceClientOffset()

            if (dropAreaRef.current) {
                const dropAreaRect = dropAreaRef.current.getBoundingClientRect()
                const left = ((clientOffset.x - dropAreaRect.x) / dropAreaRect.width) * 100
                const top = ((clientOffset.y - dropAreaRect.y) / dropAreaRect.height) * 100
                if (item.isNew) {
                    onMove(item.id, { left, top }, true)
                } else {
                    onMove(item.id, { left, top })
                }
            }
        },
    })

    return (
        <div
            className="banner-design position-relative w-100 h-100"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            ref={drop(dropAreaRef)}
        >
            {children}
        </div>
    )
})

function CreateBanner() {
    const { banner_id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentBanner, loading, error, success } = useSelector((state) => state.banner)
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    const [notificationType, setNotificationType] = useState('')
    const bannerTemplates = useMemo(() => [banner1, banner2], [])
    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [bannerInfo, setBannerInfo] = useState({
        imageUrl: '',
        title: 'Tiêu đề',
        description: 'Mô tả',
        buttonText: 'Tiêu đề nút',
        linkUrl: '',
        displayStartTime: new Date(),
        displayEndTime: new Date(),
        isActive: true,
    })
    const [elements, setElements] = useState({})
    const bannerRef = useRef(null)

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
                isActive: currentBanner.isActive,
            })
            const newElements = {}
            Object.entries(currentBanner.elements).forEach(([key, value]) => {
                newElements[key] = {
                    ...value,
                    type: key,
                }
            })
            setElements(newElements)
        }
    }, [currentBanner, banner_id])

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]
            setFile(file)
            const objectUrl = URL.createObjectURL(file)
            setBannerInfo((prev) => ({ ...prev, imageUrl: objectUrl }))
            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
    })

    const handleMove = useCallback((id, newPosition, isNew = false) => {
        setElements((prev) => {
            const existingElement = prev[id]
            return {
                ...prev,
                [id]: {
                    ...newPosition,
                    type: isNew ? id : existingElement ? existingElement.type : id,
                },
            }
        })
    }, [])

    const handleRemove = useCallback((id) => {
        setElements((prev) => {
            const newElements = { ...prev }
            delete newElements[id]
            return newElements
        })
    }, [])

    const handleSave = useCallback(async () => {
        if (!bannerInfo.imageUrl) {
            setNotificationMessage('Vui lòng chọn ảnh banner')
            setNotificationType('error')
            setShowNotification(true)
            return
        }

        try {
            setIsLoading(true)
            let downloadURL = bannerInfo.imageUrl
            const isTemplate = bannerTemplates.includes(bannerInfo.imageUrl)
            if (!isTemplate && file) {
                const storageRef = ref(storage, `banners/${Date.now()}_${file.name}`)
                const snapshot = await uploadBytes(storageRef, file)
                downloadURL = await getDownloadURL(snapshot.ref)
            }

            const bannerData = {
                ...bannerInfo,
                imageUrl: downloadURL,
                elements: {
                    title: elements.title
                        ? {
                              top: elements.title.top,
                              left: elements.title.left,
                          }
                        : {},
                    description: elements.description
                        ? {
                              top: elements.description.top,
                              left: elements.description.left,
                          }
                        : {},
                    button: elements.button
                        ? {
                              top: elements.button.top,
                              left: elements.button.left,
                          }
                        : {},
                },
            }

            if (banner_id) {
                dispatch(updateBanner({ bannerId: banner_id, bannerData }))
            } else {
                dispatch(createBannerAction(bannerData))
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            setNotificationMessage('Lỗi khi tải ảnh lên')
            setNotificationType('error')
            setShowNotification(true)
        } finally {
            setIsLoading(false)
        }
    })

    useLayoutEffect(() => {
        if (success) {
            setNotificationMessage('Banner đã được lưu thành công!')
            setNotificationType('success')
            setShowNotification(true)
            setBannerInfo({
                imageUrl: '',
                title: 'Tiêu đề',
                description: 'Mô tả',
                buttonText: 'Tiêu đề nút',
                linkUrl: '',
                displayStartTime: new Date(),
                displayEndTime: new Date(),
                isActive: true,
            })
        } else if (error) {
            setNotificationMessage('Lỗi khi lưu banner: ' + error)
            setNotificationType('error')
            setShowNotification(true)
        }
    }, [success, error])

    const handleTemplateSelect = useCallback((template) => {
        setBannerInfo((prev) => ({ ...prev, imageUrl: template }))
    })

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    const draggableElements = useMemo(
        () =>
            Object.entries(elements)
                .map(([id, element]) => {
                    if (!element || !element.type) return null
                    const { top, left, type } = element
                    return (
                        <DraggableElement key={id} id={id} position={{ top, left }} onMove={handleMove} onRemove={handleRemove}>
                            {type === 'title' && (
                                <h2 className="draggable-elements text-white fw-bold fs-2 p-2" style={{ maxWidth: '200px', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)' }}>
                                    {bannerInfo.title}
                                </h2>
                            )}
                            {type === 'description' && (
                                <p className="draggable-elements text-white fw-medium fs-5 p-2" style={{ maxWidth: '200px', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)' }}>
                                    {bannerInfo.description}
                                </p>
                            )}
                            {type === 'button' && (
                                <button className="draggable-elements primary-btn px-3 py-1">
                                    <p className="fs-5 p-0">
                                        {truncateText(bannerInfo.buttonText, 20)} <FontAwesomeIcon icon={faArrowRight} />
                                    </p>
                                </button>
                            )}
                            <button onClick={() => handleRemove(id)} className="fs-4 bg-transparent border-0 draggable-elements-close position-absolute top-0 end-0 p-0">
                                <FontAwesomeIcon icon={faCircleXmark} color="#fff" />
                            </button>
                        </DraggableElement>
                    )
                })
                .filter(Boolean),
        [elements, bannerInfo, handleMove, handleRemove, truncateText]
    )
    return (
        <DndProvider backend={HTML5Backend}>
            <p className="fs-3 fw-medium p-3 border-top border-end border-start bg-white">Thiết kế Banner</p>
            <div className="create-banner-container bg-white border p-4 pt-5 d-flex justify-content-between align-items-center h-100">
                <div className="template-list p-3 h-100 " style={{ alignSelf: 'flex-start' }}>
                    {bannerTemplates.map((template, index) => (
                        <img key={index} src={template} alt={`Template ${index + 1}`} onClick={() => handleTemplateSelect(template)} className={bannerInfo.imageUrl === template ? 'selected' : ''} />
                    ))}
                </div>
                <div className="border-start" style={{ minHeight: '80vh' }}></div>
                <div className="">
                    <div className="draggable-elements-box border d-flex justify-content-center w-100 mb-4 align-items-center">
                        <DraggableBox id="title" type="title">
                            <h2 className="text-white fw-bold fs-2 p-2" style={{ maxWidth: '200px', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)' }}>
                                Tiêu đề
                            </h2>
                        </DraggableBox>
                        <DraggableBox id="description" type="description">
                            <p className="text-white fw-medium fs-5 p-2" style={{ maxWidth: '200px', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)' }}>
                                Mô tả
                            </p>
                        </DraggableBox>
                        <DraggableBox id="button" type="button">
                            <button className="primary-btn px-3 py-1 draggable-elements">
                                <p className="fs-5 p-0">
                                    Tiêu đề nút <FontAwesomeIcon icon={faArrowRight} />
                                </p>
                            </button>
                        </DraggableBox>
                    </div>
                    <div className="banner-design position-relative" ref={bannerRef}>
                        <DropArea onMove={handleMove} onRemove={handleRemove} backgroundImage={bannerInfo.imageUrl}>
                            {bannerInfo.imageUrl ? draggableElements : null}
                        </DropArea>
                    </div>
                </div>
                <div className="border-start" style={{ minHeight: '80vh' }}></div>

                <div className="banner-info h-auto p-3">
                    <div className="input-img-banner d-flex justify-content-center align-items-center mb-3 position-relative" {...getRootProps()}>
                        <input {...getInputProps()} />
                        {bannerInfo.imageUrl ? (
                            <div className="selected-image-container">
                                <img src={bannerInfo.imageUrl} alt="Selected banner" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                <button className="change-img-banner p-3 text-white fs-3 w-100 h-100 position-absolute top-0 start-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                    Thay đổi
                                </button>
                            </div>
                        ) : (
                            <label className="custum-file-upload">
                                <div className="icon-image">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" className="upload-icon">
                                        <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                                        <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
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
                                    <span>Thêm hình ảnh</span>
                                </div>
                            </label>
                        )}
                    </div>
                    <div className="input-form d-inline-flex align-items-center w-100 my-3">
                        <input
                            className="input-text w-100"
                            type="text"
                            placeholder="Tiêu đề"
                            value={bannerInfo.title}
                            onChange={(e) => setBannerInfo((prev) => ({ ...prev, title: e.target.value }))}
                        />
                    </div>
                    <div className="input-form d-inline-flex align-items-center w-100 h-auto">
                        <textarea
                            rows={3}
                            className="input-text w-100 h-auto"
                            placeholder="Mô tả"
                            value={bannerInfo.description}
                            onChange={(e) => setBannerInfo((prev) => ({ ...prev, description: e.target.value }))}
                        />
                    </div>
                    <div className="input-form d-inline-flex align-items-center w-100 my-3">
                        <input
                            className="input-text w-100"
                            type="text"
                            placeholder="Tiêu đề nút"
                            value={bannerInfo.buttonText}
                            onChange={(e) => setBannerInfo((prev) => ({ ...prev, buttonText: e.target.value }))}
                        />
                    </div>
                    <div className="input-form d-inline-flex align-items-center w-100 mb-3">
                        <input
                            className="input-text w-100"
                            type="text"
                            placeholder="Đường link"
                            value={bannerInfo.linkUrl}
                            onChange={(e) => setBannerInfo((prev) => ({ ...prev, linkUrl: e.target.value }))}
                        />
                    </div>
                    <DatePicker
                        className="p-2 fs-4 w-100 d-block mb-3"
                        selected={bannerInfo.displayStartTime}
                        onChange={(date) => setBannerInfo((prev) => ({ ...prev, displayStartTime: date }))}
                        placeholderText="Ngày bắt đầu"
                        dateFormat="dd/MM/yyyy"
                    />
                    <DatePicker
                        className="p-2 fs-4 w-100 d-block mb-3"
                        selected={bannerInfo.displayEndTime}
                        onChange={(date) => setBannerInfo((prev) => ({ ...prev, displayEndTime: date }))}
                        placeholderText="Ngày kết thúc"
                        dateFormat="dd/MM/yyyy"
                    />
                    <button disabled={isLoading || !bannerInfo.imageUrl} className="p-3 border d-flex justify-content-center align-items-center bg-white" onClick={handleSave}>
                        <p className="fs-4 fw-medium">{isLoading ? 'Đang lưu...' : 'Lưu'}</p>
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
        </DndProvider>
    )
}

export default CreateBanner
