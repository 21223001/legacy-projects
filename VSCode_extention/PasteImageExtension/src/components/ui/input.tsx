import React from 'react';

export const Input = ({ disabled, value, onChange, placeholder }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      type="text"
      disabled={disabled}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-gray-300 p-2 rounded w-full"
    />
  );
};
