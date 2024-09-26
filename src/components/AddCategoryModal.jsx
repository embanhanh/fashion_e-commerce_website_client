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
            setSuggestions(categories)
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
            const filteredSuggestions = categories.filter((cat) => cat.name.toLowerCase().includes(value.toLowerCase()))
            setSuggestions(filteredSuggestions)
        } else {
            setSuggestions(categories)
        }
    }

    const handleSuggestionClick = (category) => {
        setParentCategory(category.name)
        setShowSuggestions(false)
    }

    const validateForm = () => {
        const newErrors = {}
        if (!parentCategory) newErrors.parentCategory = 'Danh mục cha không được để trống'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (validateForm()) {
            onAddCategory({ parentCategory, childCategory })
            handleClose()
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
                                    <ListGroup.Item className="px-3 py-2 fs-4" key={category.id} action onClick={() => handleSuggestionClick(category)}>
                                        {category.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Danh mục con (không bắt buộc)</Form.Label>
                        <div className="input-form d-flex align-items-center w-100">
                            <input type="text" className="input-text w-100" placeholder="Danh mục con" value={childCategory} onChange={(e) => setChildCategory(e.target.value)} />
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="d-flex w-100">
                <p className="text-danger">{errors.parentCategory}</p>
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
