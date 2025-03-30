'use client';
import React from 'react';

interface DraggableItemProps {
    id: string;
    children: React.ReactNode;
};

const DraggableItem : React.FC<DraggableItemProps> = ({id, children}) => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData('text/plain', id);
    }

    return (
        <div draggable onDragStart={handleDragStart}>
            {children}
        </div>
    );
}

export default DraggableItem;