import React from 'react';

type CheckboxProps = {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export const Checkbox = ({ id, checked, onCheckedChange }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="mr-2"
    />
  );
};
