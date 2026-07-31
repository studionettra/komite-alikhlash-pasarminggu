import React, { useState, useRef, useEffect } from 'react';
import { CaretDown, Check } from '@phosphor-icons/react';

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    value: string | number;
    onChange: (value: string | number) => void;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
}

export default function Select({ value, onChange, options, placeholder = "Pilih...", className = "" }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => String(opt.value) === String(value)) || null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-slate-300 rounded-xl hover:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left shadow-sm"
            >
                <span className={`block truncate ${!selectedOption ? 'text-slate-400' : 'text-slate-700 font-semibold'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <CaretDown weight="bold" className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">
                    <ul className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
                        {options.map((option) => {
                            const isSelected = String(option.value) === String(value);
                            return (
                                <li key={option.value}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                                            isSelected 
                                            ? 'bg-blue-50 text-blue-700 font-bold' 
                                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                                        }`}
                                    >
                                        <span className="truncate">{option.label}</span>
                                        {isSelected && <Check weight="bold" className="w-4 h-4 text-blue-600 shrink-0" />}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
