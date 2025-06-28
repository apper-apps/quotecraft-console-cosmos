import React from 'react'
import Input from '@/components/atoms/Input'
import TextArea from '@/components/atoms/TextArea'

const FormField = ({ 
  type = 'input',
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  rows,
  icon,
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(name, e.target.value)
    }
  }

  const commonProps = {
    label,
    value,
    onChange: handleChange,
    error,
    required,
    placeholder,
    ...props
  }

  if (type === 'textarea') {
    return (
      <TextArea
        rows={rows}
        {...commonProps}
      />
    )
  }

  return (
    <Input
      type={type}
      icon={icon}
      {...commonProps}
    />
  )
}

export default FormField