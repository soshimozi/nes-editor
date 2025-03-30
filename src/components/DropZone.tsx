'use client';

import React, {useState} from 'react';

interface DropZoneProps {
    onDrop: (itemId: string) => void;
    children: React.ReactNode;
    className?: string;
};

const DropZone: React.FC<DropZoneProps> = ({onDrop, children, className}) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = () => {
        setIsOver(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(false);
        const itemId = event.dataTransfer.getData('text/plain');
        onDrop(itemId);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={className}
            style={{}}
        >
            {children}
        </div>
    )
}

export default DropZone;