import React, { useState, useEffect, useRef } from 'react'
import { Modal, Form, ListGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { addNewCategory } from '../redux/slices/categorySlice'
import { useDispatch } from 'react-redux'
import './AddCategoryModal.scss'

const AddCategoryModal = ({ show, handleClose, categories }) => {
    const dispatch = useDispatch()
    const [parentCategory, setParentCategory] = useState('')
    const [childCategory, setChildCategory] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [categoryImage, setCategoryImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [errors, setErrors] = useState({})
    const inputRef = useRef(null)
    const suggestionsRef = useRef(null)

    useEffect(() => {
        if (show) {
            setParentCategory('')
            setChildCategory('')
            setErrors({})
            setShowSuggestions(false)
            // Chỉ lấy các danh mục cha (không có parentCategory)
            setSuggestions(categories.filter((cat) => !cat.parentCategory))
            setCategoryImage(null)
            setPreviewImage(null)
        }
    }, [show, categories])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)
            ) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (previewImage) {
                URL.revokeObjectURL(previewImage)
            }

            setCategoryImage(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setCategoryImage(null)
        setPreviewImage(null)
    }

    const handleParentCategoryChange = (e) => {
        const value = e.target.value
        setParentCategory(value)
        setShowSuggestions(true)
        if (value) {
            // Lọc chỉ các danh mục cha phù hợp với input
            const filteredSuggestions = categories
                .filter((cat) => !cat.parentCategory)
                .filter((cat) => cat.name.toLowerCase().includes(value.toLowerCase()))
            setSuggestions(filteredSuggestions)
        } else {
            // Nếu input rỗng, hiển thị tất cả danh mục cha
            setSuggestions(categories.filter((cat) => !cat.parentCategory))
        }
    }

    const handleSuggestionClick = (category) => {
        setParentCategory(category.name)
        if (category.urlImage) {
            setCategoryImage(category.urlImage)
            setPreviewImage(category.urlImage)
        }
        setShowSuggestions(false)
    }

    const validateForm = () => {
        const newErrors = {}
        if (!parentCategory || !categoryImage) {
            newErrors.parentCategory = 'Vui lòng nhập và chọn hình ảnh cho danh mục lớn'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const formData = new FormData()
                formData.append('parentCategory', parentCategory)
                formData.append('childCategory', childCategory)
                formData.append('urlImage', categoryImage)
                await dispatch(addNewCategory(formData)).unwrap()
                handleClose()
            } catch (e) {
                setErrors({ ...errors, submit: e.message || 'Có lỗi xảy ra khi tạo danh mục' })
            }
        }
    }

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage)
            }
        }
    }, [])

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm danh mục mới</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <Form>
                    <Form.Group className="mb-3 parent-category-group">
                        <Form.Label className="fs-4">Danh mục lớn (bắt buộc)</Form.Label>
                        <div className="input-form d-flex align-items-center w-100">
                            <input
                                type="text"
                                className="input-text w-100"
                                placeholder="Danh mục lớn"
                                value={parentCategory}
                                onChange={handleParentCategoryChange}
                                onFocus={() => setShowSuggestions(true)}
                                ref={inputRef}
                            />
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <ListGroup className="suggestions-list scrollbar-y" ref={suggestionsRef}>
                                {suggestions.map((category) => (
                                    <ListGroup.Item
                                        className="p-3 fs-4"
                                        key={category._id}
                                        action
                                        onClick={() => handleSuggestionClick(category)}
                                    >
                                        {category.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Form.Group>
                    <div className="mt-3">
                        {!previewImage && (
                            <label className="custum-file-upload p-1" style={{ width: 90, height: 120 }}>
                                <div className="icon-image">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill=""
                                        viewBox="0 0 24 24"
                                        className="upload-icon"
                                    >
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
                                <div className="text">
                                    <span>Thêm hình ảnh</span>
                                </div>
                                <input
                                    type="file"
                                    id="main-product-images"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                        {previewImage && (
                            <div className="position-relative image_add-category " style={{ width: 90, height: 120 }}>
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-100 h-100 object-fit-cover rounded-4"
                                />
                                <button
                                    className="position-absolute top-0 end-0 start-0 bottom-0 rm-image_add-category rounded-4"
                                    onClick={removeImage}
                                    type="button"
                                >
                                    <FontAwesomeIcon icon={faCircleXmark} className="fs-1" />
                                </button>
                            </div>
                        )}
                    </div>
                    <Form.Group className="mt-3">
                        <Form.Label className="fs-4">Danh mục nhỏ</Form.Label>
                        <div className="input-form d-flex align-items-center w-100">
                            <input
                                type="text"
                                className="input-text w-100"
                                placeholder="Danh mục nhỏ"
                                value={childCategory}
                                onChange={(e) => setChildCategory(e.target.value)}
                                required
                            />
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="d-flex w-100">
                <p className="text-danger">{errors.parentCategory}</p>
                <p className="text-danger">{errors.submit}</p>
                <div onClick={handleClose} className="border py-2 px-4" style={{ cursor: 'pointer' }}>
                    <p className="fs-3 text-body-secondary">Đóng</p>
                </div>
                <div className="primary-btn py-2 px-4 shadow-none rounded-0" onClick={handleSubmit}>
                    <p>Thêm danh mục</p>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default AddCategoryModal
