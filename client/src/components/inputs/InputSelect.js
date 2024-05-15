import React, { memo } from 'react'

const InputSelect = ({ value, changeValue, option }) => {
    return (
        <select
            value={value}
            onChange={e => changeValue(e.target.value)}
            className=''>
            <option value='option'>Random</option>
            {option?.map(el => (
                <option
                    key={el.id}
                    value={el.value}
                >{el.text}</option>
            ))}
        </select>
    )
}

export default memo(InputSelect)
