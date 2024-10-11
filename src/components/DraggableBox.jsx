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
            }}
            className="draggable-elements-container"
        >
            {children}
        </div>
    )
}

export default DraggableBox
