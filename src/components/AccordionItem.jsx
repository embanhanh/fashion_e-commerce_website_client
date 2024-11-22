import './AccordionItem.scss'
import React, { useRef, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

function AccordionItem({ title, content, isOpen, onClick, childrenItem, isChecked, onSelect, selectedItems, idParent }) {
    const contentRef = useRef(null)
    const [height, setHeight] = useState('0px')
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setHeight(`${contentRef.current.scrollHeight + 1}px`)
        } else {
            setHeight(`${contentRef.current.scrollHeight + 1}px`)
            requestAnimationFrame(() => {
                setHeight('0px')
            })
        }
    }, [isOpen, childrenItem])

    const handleTransitionEnd = () => {
        if (!isOpen) {
            setHeight('0px')
        }
        setIsAnimating(false)
    }

    const handleClick = () => {
        setIsAnimating(true)
        onClick()
    }

    const handleCheckboxChange = (item, isChecked, childrenIds, idParent) => {
        onSelect(item, isChecked, childrenIds, idParent)
    }

    return (
        <div className="accordion-item-custom">
            <div className="accordion-title-custom d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center p-2  flex-grow-1">
                    {isChecked && (
                        <label className="d-flex align-items-center">
                            <input
                                type="checkbox"
                                className="input-checkbox"
                                onChange={(e) =>
                                    handleCheckboxChange(
                                        idParent,
                                        e.target.checked,
                                        content.map((child) => child.id)
                                    )
                                }
                                checked={selectedItems.includes(idParent)}
                            />
                            <span className="custom-checkbox"></span>
                        </label>
                    )}
                    <p className={`${!isChecked && 'fw-bold '} fs-4 fw-medium ms-2 flex-grow-1`} onClick={handleClick}>
                        {title}
                    </p>
                </div>
                {(content || childrenItem) && <span onClick={handleClick}>{isOpen ? <FontAwesomeIcon size="lg" icon={faChevronUp} /> : <FontAwesomeIcon size="lg" icon={faChevronDown} />}</span>}
            </div>
            <div className="accordion-content-wrapper  ms-4" style={{ height: isAnimating ? height : isOpen ? 'auto' : '0px' }} onTransitionEnd={handleTransitionEnd}>
                <div className="accordion-content-custom " ref={contentRef}>
                    {content
                        ? content.map((item, index) => (
                              <div className="d-flex align-items-center" key={index}>
                                  {isChecked && (
                                      <label className="d-flex align-items-center">
                                          <input
                                              type="checkbox"
                                              className="input-checkbox"
                                              checked={selectedItems.includes(item.id) || selectedItems.includes(idParent)}
                                              onChange={(e) => {
                                                  handleCheckboxChange(item.id, e.target.checked, [], idParent)
                                              }}
                                          />
                                          <span className="custom-checkbox"></span>
                                      </label>
                                  )}
                                  <p className="ms-3 fw-medium fs-4" onClick={handleClick}>
                                      {item.name}
                                  </p>
                              </div>
                          ))
                        : childrenItem}
                </div>
            </div>
        </div>
    )
}

export default AccordionItem
