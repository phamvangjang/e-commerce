import React, { memo } from 'react'
import icons from '../ultils/icons'

const { FaAngleDown } = icons
const SearchItem = ({ name, activeClick, changeActiveFilter }) => {
    return (
        <div
            onClick={() => changeActiveFilter(name)}
            className='text-gray-500 cursor-pointer gap-6 p-4 text-sm relative border border-gray-800 flex justify-between items-center'>
            <span className='capitalize'>{name}</span>
            <FaAngleDown />
            {activeClick === name && <div className='absolute top-full left-0 w-fit p-4 bg-gray-300'>
                Content
            </div>}
        </div>
    )
}

export default memo(SearchItem)
