import React, { useState, useEffect, useRef } from 'react'
import { Modal, Form, ListGroup } from 'react-bootstrap'
import './AddCategoryModal.scss'

const AddCategoryModal = ({ show, handleClose, categories, onAddCategory }) => {
    const [parentCategory, setParentCategory] = useState('')
    const [childCategory, setChildCategory] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
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
        }
    }, [show, categories])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleParentCategoryChange = (e) => {
        const value = e.target.value
        setParentCategory(value)
        setShowSuggestions(true)
        if (value) {
            // Lọc chỉ các danh mục cha phù hợp với input
            const filteredSuggestions = categories.filter((cat) => !cat.parentCategory).filter((cat) => cat.name.toLowerCase().includes(value.toLowerCase()))
            setSuggestions(filteredSuggestions)
        } else {
            // Nếu input rỗng, hiển thị tất cả danh mục cha
            setSuggestions(categories.filter((cat) => !cat.parentCategory))
        }
    }

    const handleSuggestionClick = (category) => {
        setParentCategory(category.name)
        setShowSuggestions(false)
    }

    const validateForm = () => {
        const newErrors = {}
        if (!childCategory) {
            newErrors.childCategory = 'Vui lòng nhập danh mục con'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                await onAddCategory({ parentCategory, childCategory })
                handleClose()
            } catch (error) {
                setErrors({ ...errors, submit: error.message || 'Có lỗi xảy ra khi tạo danh mục' })
            }
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm danh mục mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3 parent-category-group">
                        <Form.Label>Danh mục cha</Form.Label>
                        <div className="input-form d-flex align-items-center w-100">
                            <input
                                type="text"
                                className="input-text w-100"
                                placeholder="Danh mục cha"
                                value={parentCategory}
                                onChange={handleParentCategoryChange}
                                onFocus={() => setShowSuggestions(true)}
                                ref={inputRef}
                            />
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <ListGroup className="suggestions-list" ref={suggestionsRef}>
                                {suggestions.map((category) => (
                                    <ListGroup.Item className="px-3 py-2 fs-4" key={category._id} action onClick={() => handleSuggestionClick(category)}>
                                        {category.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Danh mục con (bắt buộc)</Form.Label>
                        <div className="input-form d-flex align-items-center w-100">
                            <input type="text" className="input-text w-100" placeholder="Danh mục con" value={childCategory} onChange={(e) => setChildCategory(e.target.value)} required />
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="d-flex w-100">
                <p className="text-danger">{errors.childCategory}</p>
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
