import React, { useState, useEffect, useRef } from 'react'
import './CategoryDropdown.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

const CategoryDropdown = ({ categories, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [activeParent, setActiveParent] = useState(null)
    const dropdownRef = useRef(null)
    const timeoutRef = useRef(null)

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
        setSelectedCategory(category)
        onSelect(category)
        setIsOpen(false)
        setActiveParent(null)
    }

    return (
        <div className="category-dropdown" ref={dropdownRef}>
            <div className="dropdown-header form-control d-flex justify-content-between align-items-center py-3 rounded-0" onClick={() => setIsOpen(!isOpen)}>
                <span className="fs-4 text-body-secondary fw-medium">{selectedCategory ? `${selectedCategory.parent.name} > ${selectedCategory.name}` : 'Chọn danh mục'}</span>
                <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} className="ms-3" />
            </div>
            {isOpen && (
                <div className="dropdown-content shadow" onMouseLeave={handleContentMouseLeave} style={{ width: `${activeParent ? '200%' : '100%'}` }}>
                    <div className="d-flex">
                        <div className={`parent-list  ${activeParent ? 'w-50' : 'w-100'}`}>
                            <ul className="list-group list-group-flush">
                                {categories.map((parent) => (
                                    <li key={parent.id} className={`list-group-item py-3 px-4 ${activeParent === parent.id ? 'active' : ''}`} onMouseEnter={() => handleParentHover(parent.id)}>
                                        {parent.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {activeParent && (
                            <div className="child-list w-50">
                                <ul className="list-group list-group-flush">
                                    {categories
                                        .find((parent) => parent.id === activeParent)
                                        .children.map((child) => (
                                            <li key={child.id} className="list-group-item py-3 px-4" onClick={() => handleSelect({ ...child, parent: categories.find((p) => p.id === activeParent) })}>
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
