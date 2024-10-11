import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { DndProvider, useDrag, useDrop, useDragLayer } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useDropzone } from 'react-dropzone'
import html2canvas from 'html2canvas'
// import axios from 'axios';
// import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import './CreateBanner.scss'
import banner1 from '../../assets/image/banner/banner1.png'
import banner2 from '../../assets/image/banner/banner2.png'

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
                top: position.top,
                left: position.left,
                opacity: isDragging ? 0.5 : 1,
                border: isDragging ? '1px solid #fff' : 'none',
                cursor: 'move',
                userSelect: 'none',
            }}
        >
            {children}
        </div>
    )
})

function DropArea({ children, onMove, backgroundImage }) {
    const [, dropRef] = useDrop({
        accept: 'element',
        drop: (item, monitor) => {
            const delta = monitor.getDifferenceFromInitialOffset()
            if (delta) {
                onMove(item.id, {
                    top: Math.round(item.top + delta.y),
                    left: Math.round(item.left + delta.x),
                })
            }
        },
    })

    return (
        <div className="banner-design position-relative w-100 h-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} ref={dropRef}>
            {children}
        </div>
    )
}

function CreateBanner() {
    const [bannerTemplates, setBannerTemplates] = useState([banner1, banner2])
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
    const [elements, setElements] = useState({
        title: { top: 70, left: 70 },
        description: { top: 90, left: 70 },
        button: { top: 175, left: 70 },
    })
    const bannerRef = useRef(null)

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]
            const reader = new FileReader()
            reader.onload = (e) => {
                setBannerInfo((prev) => ({ ...prev, imageUrl: e.target.result }))
            }
            reader.readAsDataURL(file)
        }
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
    })

    const handleMove = useCallback((id, newPosition) => {
        setElements((prev) => ({
            ...prev,
            [id]: newPosition,
        }))
    }, [])
    const handleSave = async () => {
        const canvas = await html2canvas(bannerRef.current)
        const blob = await new Promise((resolve) => canvas.toBlob(resolve))
        const file = new File([blob], 'banner.png', { type: 'image/png' })

        // const storageRef = ref(storage, `banners/${file.name}`);
        // await uploadBytes(storageRef, file);
        // const downloadURL = await getDownloadURL(storageRef);

        // const bannerData = {
        //   ...bannerInfo,
        //   imageUrl: downloadURL,
        //   elements: elements,
        // };

        // try {
        //   await axios.post('/api/banner/create', bannerData);
        //   alert('Banner saved successfully!');
        // } catch (error) {
        //   console.error('Error saving banner:', error);
        //   alert('Failed to save banner');
        // }
    }

    const handleTemplateSelect = (template) => {
        setBannerInfo((prev) => ({ ...prev, imageUrl: template }))
    }

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    const draggableElements = useMemo(
        () => ({
            title: (
                <DraggableElement key="title" id="title" position={elements.title}>
                    <h2 className="text-white fw-bold fs-2" style={{ maxWidth: '200px', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)' }}>
                        {bannerInfo.title}
                    </h2>
                </DraggableElement>
            ),
            description: (
                <DraggableElement key="description" id="description" position={elements.description}>
                    <p className="text-white fw-medium fs-5" style={{ maxWidth: '200px', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)' }}>
                        {bannerInfo.description}
                    </p>
                </DraggableElement>
            ),
            button: (
                <DraggableElement key="button" id="button" position={elements.button}>
                    <button className="primary-btn px-3 py-1">
                        <p className="fs-5 p-0">
                            {truncateText(bannerInfo.buttonText, 20)} <FontAwesomeIcon icon={faArrowRight} />
                        </p>
                    </button>
                </DraggableElement>
            ),
        }),
        [elements, bannerInfo, truncateText]
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
                <div className="banner-design position-relative" ref={bannerRef}>
                    <DropArea onMove={handleMove} backgroundImage={bannerInfo.imageUrl}>
                        {bannerInfo.imageUrl ? Object.values(draggableElements) : null}
                    </DropArea>
                </div>
                <div className="border-start" style={{ minHeight: '80vh' }}></div>

                <div className="banner-info h-auto p-3">
                    <div className="d-flex justify-content-center align-items-center mb-3" {...getRootProps()}>
                        <input {...getInputProps()} />
                        {bannerInfo.imageUrl ? (
                            <div className="selected-image-container">
                                <img src={bannerInfo.imageUrl} alt="Selected banner" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                <button
                                    className="p-3 bg-white"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setBannerInfo((prev) => ({ ...prev, imageUrl: '' }))
                                    }}
                                >
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
                    <button className="p-3 border d-block bg-white" onClick={handleSave}>
                        <p className="fs-4 fw-medium">Lưu</p>
                    </button>
                </div>
            </div>
        </DndProvider>
    )
}

export default CreateBanner
