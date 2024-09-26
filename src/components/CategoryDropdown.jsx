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
        return categories.reduce((acc, category) => {
            if (!category.children || category.children.length === 0) {
                // Nếu danh mục không có con và chưa được chọn, giữ lại
                if (!selectedCategories.some((selectedCat) => selectedCat.id === category.id)) {
                    acc.push(category)
                }
            } else {
                // Lọc danh mục con chưa được chọn
                const filteredChildren = category.children.filter((child) => !selectedCategories.some((selectedCat) => selectedCat.id === child.id && selectedCat.parent.id === category.id))

                // Nếu còn danh mục con chưa được chọn, giữ lại danh mục cha với danh sách con đã lọc
                if (filteredChildren.length > 0) {
                    acc.push({
                        ...category,
                        children: filteredChildren,
                    })
                }
            }
            return acc
        }, [])
    }, [categories, selectedCategories])

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

    const activeParentCategory = activeParent ? filteredCategories.find((cat) => cat.id === activeParent) : null
    const showChildList = activeParentCategory && activeParentCategory.children && activeParentCategory.children.length > 0

    return (
        <div className="category-dropdown" ref={dropdownRef}>
            <div className="dropdown-header form-control d-flex justify-content-between align-items-center py-3 rounded-0" onClick={() => setIsOpen(!isOpen)}>
                <span className="fs-4 text-body-secondary fw-medium">{selectedCategories.length > 0 ? `Đã chọn ${selectedCategories.length} danh mục` : 'Chọn danh mục'}</span>
                <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} className="ms-3" />
            </div>
            {isOpen && filteredCategories.length > 0 && (
                <div className="dropdown-content shadow mt-2" onMouseLeave={handleContentMouseLeave} style={{ width: showChildList ? '200%' : '100%' }}>
                    <div className="d-flex">
                        <div className={`parent-list ${showChildList ? 'w-50' : 'w-100'}`}>
                            <ul className="list-group list-group-flush">
                                {filteredCategories.map((parent) => (
                                    <li
                                        key={parent.id}
                                        className={`list-group-item py-3 px-4 ${activeParent === parent.id ? 'active' : ''}`}
                                        onMouseEnter={() => handleParentHover(parent.id)}
                                        onClick={() => (!parent.children || parent.children.length === 0 ? handleSelect(parent) : null)}
                                    >
                                        {parent.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {showChildList && (
                            <div className="child-list w-50">
                                <ul className="list-group list-group-flush">
                                    {activeParentCategory.children.map((child) => (
                                        <li key={child.id} className="list-group-item py-3 px-4" onClick={() => handleSelect({ ...child, parent: activeParentCategory })}>
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
