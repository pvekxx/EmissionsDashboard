import React from 'react';

export interface FilterControlProps {
    label: string;
    children: React.ReactNode;
}

const FilterControl: React.FC<FilterControlProps> = ({ label, children }) => {
    return (
        <div className="flex items-center">
            <label className="text-sm text-neutral-300 pr-2">
                {label}
            </label>
            {children}
        </div>
    );
};

export default FilterControl;