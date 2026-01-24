import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi2';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full bg-dark-800 border rounded-lg px-4 py-2.5 text-white appearance-none cursor-pointer
              focus:outline-none focus:ring-1 transition-all duration-200
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-dark-600 focus:border-primary-500 focus:ring-primary-500'}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" className="text-gray-500">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-dark-800 text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
          <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="text-gray-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
