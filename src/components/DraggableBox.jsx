import React from 'react'
import { useDrag } from 'react-dnd'

const DraggableBox = ({ id, children, type }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'element',
        item: { id, type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                padding: '5px',
                margin: '5px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px',
            }}
        >
            {children}
        </div>
    )
}

export default DraggableBox
