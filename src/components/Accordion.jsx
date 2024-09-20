import './Accordion.scss'
import React, { useEffect, useState } from 'react'
import AccordionItem from './AccordionItem'

function Accordion({ data, children, isOpen }) {
    const [openIndices, setOpenIndices] = useState([])

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
                />
            ))}
        </div>
    )
}

export default Accordion
