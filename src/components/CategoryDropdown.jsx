import React, { useState, useEffect, useRef, useMemo } from 'react'
import './CategoryDropdown.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

const CategoryDropdown = ({ categories, onSelect, selectedCategories }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeParent, setActiveParent] = useState(null)
    const dropdownRef = useRef(null)
    const timeoutRef = useRef(null)

    const filteredCategories = useMemo(() => {
        return categories
            .filter((category) => !category.parentCategory)
            .map((parent) => ({
                ...parent,
                children: categories.filter((child) => child.parentCategory && child.parentCategory._id === parent._id),
            }))
    }, [categories])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
                setActiveParent(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const handleParentHover = (parentId) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setActiveParent(parentId)
    }

    const handleContentMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveParent(null)
        }, 100)
    }

    const handleSelect = (category) => {
        onSelect(category)
        setIsOpen(false)
        setActiveParent(null)
    }

    const activeParentCategory = activeParent ? filteredCategories.find((cat) => cat._id === activeParent) : null
    const showChildList = activeParentCategory && activeParentCategory.children && activeParentCategory.children.length > 0

    return (
        <div className="category-dropdown" ref={dropdownRef}>
            <div className="dropdown-header form-control d-flex justify-content-between align-items-center py-3 rounded-0" onClick={() => setIsOpen(!isOpen)}>
                <span className="fs-4 text-body-secondary fw-medium">{selectedCategories.length > 0 ? `Đã chọn ${selectedCategories.length} danh mục` : 'Chọn danh mục'}</span>
                <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} className="ms-3" />
            </div>
            {isOpen && filteredCategories.length > 0 && (
                <div className="dropdown-content shadow mt-2" style={{ width: activeParent ? '200%' : '100%' }}>
                    <div className="d-flex">
                        <div className={`parent-list ${activeParent ? 'w-50' : 'w-100'}`}>
                            <ul className="list-group list-group-flush">
                                {filteredCategories.map((parent) => (
                                    <li
                                        key={parent._id}
                                        className={`list-group-item py-3 px-4 ${activeParent === parent._id ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveParent(parent._id)}
                                        onClick={() => (!parent.children || parent.children.length === 0 ? handleSelect(parent) : null)}
                                    >
                                        {parent.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {activeParent && (
                            <div className="child-list w-50">
                                <ul className="list-group list-group-flush">
                                    {filteredCategories
                                        .find((cat) => cat._id === activeParent)
                                        ?.children.map((child) => (
                                            <li key={child._id} className="list-group-item py-3 px-4" onClick={() => handleSelect(child)}>
                                                {child.name}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoryDropdown
