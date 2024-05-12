import React, { memo, useState, useEffect } from 'react'
import icons from '../ultils/icons'
import { color } from '../ultils/contants'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'

const { FaAngleDown } = icons
const SearchItem = ({ name, activeClick, changeActiveFilter, type = 'checkbox' }) => {
    const navigate = useNavigate()
    const { category } = useParams()
    const [selected, setSelected] = useState([])

    const handleSelect = (e) => {
        const alreadyEl = selected.find(el => el === e.target.value)
        if (alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
        else setSelected(prev => [...prev, e.target.value])
        changeActiveFilter(null)
    }

    useEffect(() => {
        navigate({
            pathname: `/${category}`,
            search: createSearchParams({
                color: selected
            }).toString()
        })
    }, [selected])
    return (
        <div
            onClick={() => changeActiveFilter(name)}
            className='text-gray-500 cursor-pointer gap-6 p-4 text-sm relative border border-gray-800 flex justify-between items-center'>
            <span className='capitalize'>{name}</span>
            <FaAngleDown />
            {activeClick === name && <div className='z-50 absolute top-[calc(100%+3px)] left-0 w-fit p-4 bg-gray-100'>
                {type === 'checkbox' &&
                    <div className=''>
                        <div className='p-4 items-center flex justify-between gap-8'>
                            <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                            <span
                                onClick={e => {
                                    e.stopPropagation()
                                    setSelected([])
                                }}
                                className='underline cursor-pointer hover:text-main'>Reset</span>
                        </div>
                        <div className='flex flex-col justify-start gap-3' onClick={e => e.stopPropagation()}>
                            {color.map((el, index) => (
                                <div key={index} className='flex gap-2 items-center'>
                                    <input
                                        type='checkbox'
                                        name={el}
                                        value={el}
                                        onChange={handleSelect}
                                        id={el}
                                        checked={selected.some(selectedItem => selectedItem === el)}
                                    />
                                    <label className='capitalize text-gray-800' htmlFor={el}>{el}</label>
                                </div>
                            ))}
                        </div>
                    </div>}
            </div>}
        </div>
    )
}

export default memo(SearchItem)
