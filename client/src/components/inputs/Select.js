import React, { memo } from 'react'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'


const Select = ({
    label,
    options = [],
    register,
    errors,
    id,
    validate,
    style,
    fullWidth,
    defaultValue }) => {
    // const { register, formState : { errors } } = useForm()
    return (
        <div className={clsx('flex flex-col gap-2', style)}>
            {label && <label htmlFor={id} >{label}</label>}
            <select
                defaultValue={defaultValue}
                className={clsx('text-gray-900 p-2 border-none', fullWidth && 'w-full', style)}
                id={id}
                {...register(id, validate)}
            >
                <option
                    value=""
                >---CHOOSE---</option>
                {options?.map(el => (
                    <option
                        className='border-none p-2'
                        value={el.code}>
                        {el.value}
                    </option>
                ))}
            </select>
            {
                errors[id] && <small
                    className='text-xs text-main'
                >{errors[id]?.message}</small>
            }
        </div >
    )
}

export default memo(Select)
