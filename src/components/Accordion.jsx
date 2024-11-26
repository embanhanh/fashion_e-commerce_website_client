import './Accordion.scss'
import React, { useEffect, useState } from 'react'
import AccordionItem from './AccordionItem'

function Accordion({ data, children, isOpen, onChange }) {
    const [openIndices, setOpenIndices] = useState([])
    const [selectedItems, setSelectedItems] = useState([])

    useEffect(() => {
        if (isOpen) {
            const allIndices = data.map((_, index) => index)
            setOpenIndices(allIndices)
        }
    }, [data])

    const handleToggle = (index) => {
        if (openIndices.includes(index)) {
            setOpenIndices(openIndices.filter((i) => i !== index))
        } else {
            setOpenIndices([...openIndices, index])
        }
    }

    const handleItemSelect = (item, isSelected, childrenIds = [], idParent = null) => {
        let newSelectedItems
        if (isSelected) {
            newSelectedItems = [...selectedItems, item, ...childrenIds]
        } else {
            if (idParent) {
                newSelectedItems = selectedItems.filter((i) => i !== item && i !== idParent)
            } else {
                newSelectedItems = selectedItems.filter((i) => i !== item && !childrenIds.includes(i))
            }
        }
        setSelectedItems(newSelectedItems)
        onChange(newSelectedItems)
    }

    return (
        <div className="accordion-custom">
            {data.map((item, index) => (
                <AccordionItem
                    isChecked={item.isChecked}
                    childrenItem={children}
                    key={index}
                    title={item.title}
                    content={item.content}
                    isOpen={openIndices.includes(index)}
                    onClick={() => handleToggle(index)}
                    onSelect={handleItemSelect}
                    selectedItems={selectedItems}
                    idParent={item.id}
                />
            ))}
        </div>
    )
}

export default Accordion
