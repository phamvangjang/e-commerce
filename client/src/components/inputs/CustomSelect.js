import React from 'react'
import Select from './Select'
import clsx from 'clsx'

const CustomSelect = ({
    // id,
    // register,
    // validate,
    classname,
    label,
    onChange,
    options = [],
    placeholder,
    value,
    wrapClassname,
}) => {
    return (
        <div className={clsx(wrapClassname)}>
            {label && <h3 className='font-medium'>{label}</h3>}
            <Select
                // id={id}
                // {...register(id, validate)}
                // register={register}
                placeholder={placeholder}
                isClearable
                options={options}
                value={value}
                isSearchable
                onChange={(val) => onChange(val)}
                formatOptionLabel={(option) => (
                    <div className='flex text-black items-center gap-2'>
                        <span>{option.label}</span>
                    </div>
                )}
                className={{ control: () => clsx('border-2 py-[2px]', classname) }}
            />
        </div>
    )
}

export default CustomSelect
