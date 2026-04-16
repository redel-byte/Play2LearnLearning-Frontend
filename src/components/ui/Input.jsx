import { forwardRef } from 'react';

const Input = forwardRef(({ name, label, type, value, onChange, placeholder, error, variant = 'primary', ...rest }, ref) => {

    const getVariantClasses = () => {
        switch (variant) {
            case 'secondary':
                return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
            case 'success':
                return 'border-green-300 focus:border-green-500 focus:ring-green-500';
            case 'danger':
                return 'border-red-300 focus:border-red-500 focus:ring-red-500';
            default:
                return 'border-blue-300 focus:border-blue-600 focus:ring-blue-600';
        }
    };

    return (
        <div className={`mb-4 ${error ? 'has-error' : ''}`}>
            <label 
                htmlFor={name} 
                className={`block text-sm font-medium mb-1 ${
                    error ? 'text-red-600' : 
                    variant === 'secondary' ? 'text-gray-700' :
                    variant === 'success' ? 'text-green-700' :
                    variant === 'danger' ? 'text-red-700' :
                    'text-blue-700'
                }`}
            >
                {label}
            </label>
            <input
                ref={ref}
                type={type}
                value={value}
                onChange={onChange}
                name={name}
                id={name}
                className={`w-full px-3 py-2 border rounded-t-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${getVariantClasses()}`}
                placeholder={placeholder}
                {...rest}
            />
            {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-b-sm px-2 py-1">
                    {error}
                </div>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
