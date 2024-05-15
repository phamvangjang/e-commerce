import React, { memo, useState, useEffect, Children } from 'react'
import icons from '../../ultils/icons'
import { color } from '../../ultils/contants'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiGetProducts } from '../../apis'
import useDebounce from '../../hooks/useDebounce'

const { FaAngleDown } = icons
const SearchItem = ({ name, activeClick, changeActiveFilter, type = 'checkbox' }) => {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const { category } = useParams()
    const [selected, setSelected] = useState([])
    const [bestPrice, setBestPrice] = useState(null)

    const [price, setPrice] = useState({
        from: '',
        to: ''
    })

    const handleSelect = (e) => {
        const alreadyEl = selected?.find(el => el === e.target.value)
        if (alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
        else setSelected(prev => [...prev, e.target.value])
        changeActiveFilter(null)
    }

    const fetchBestPriceProduct = async () => {
        const response = await apiGetProducts({ sort: '-price', limit: 1 })
        if (response.success) setBestPrice(response.products[0]?.price)
    }

    useEffect(() => {
        let param = []
        for (let i of params.entries()) param.push(i)
        const queries = {}
        for (let i of params) queries[i[0]] = i[1]
        if (selected?.length > 0) {
            queries.color = selected?.join(',')
            queries.page = 1
        } else delete queries.color
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })
    }, [selected])
    // console.log(selected)

    useEffect(() => {
        if (type === 'input') fetchBestPriceProduct()
    }, [type])
    // console.log(bestPrice)

    useEffect(() => {
        if (price.from && price.to && price.from > price.to) alert('From price cannot greater than to To price!!!')
    }, [price])

    const debouncePriceFrom = useDebounce(price.from, 500)
    const debouncePriceTo = useDebounce(price.to, 500)

    useEffect(() => {
        let param = []
        for (let i of params.entries()) param.push(i)
        const queries = {}
        for (let i of params) queries[i[0]] = i[1]

        const data = {}

        if (Number(price.from) > 0) queries.from = price.from
        else delete queries.from
        if (Number(price.to) > 0) queries.to = price.to
        else delete queries.to
        queries.page = 1

        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })

    }, [debouncePriceFrom, debouncePriceTo])

    return (
        <div
            onClick={() => changeActiveFilter(name)}
            className='text-gray-500 cursor-pointer gap-6 p-4 text-sm relative border border-gray-800 flex justify-between items-center'>
            <span className='capitalize'>{name}</span>
            <FaAngleDown />
            {activeClick === name && <div className='z-50 absolute top-[calc(100%+3px)] left-0 w-fit p-4 bg-gray-100'>
                {type === 'checkbox' &&
                    <div className=''>
                        <div className='p-4 items-center flex justify-between gap-8 border-b-2'>
                            <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                            <span
                                onClick={e => {
                                    e.stopPropagation()
                                    setSelected([])
                                    changeActiveFilter(null)
                                }}
                                className='underline cursor-pointer hover:text-main'>Reset</span>
                        </div>
                        <div
                            className='mt-3 flex flex-col justify-start gap-3'
                            onClick={e => e.stopPropagation()}>
                            {color.map((el, index) => (
                                <div key={index} className='flex gap-2 items-center'>
                                    <input
                                        type='checkbox'
                                        // name={el}
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

                {type === 'input' && <div onClick={e => e.stopPropagation()}>
                    <div
                        onClick={e => e.stopPropagation()}
                        className='p-4 items-center flex justify-between gap-8 border-b-2'>
                        <span className='whitespace-nowrap'>{`The highest price is ${Number(bestPrice).toLocaleString()} VND`}</span>
                        <span
                            onClick={e => {
                                e.stopPropagation()
                                setPrice({ from: '', to: '' })
                                changeActiveFilter(null)
                            }}
                            className='underline cursor-pointer hover:text-main'>Reset</span>
                    </div>
                    <div
                        className='mt-3 flex items-center gap-2'>
                        <div className='flex items-center gap-2'>
                            <label htmlFor='from'>From</label>
                            <input
                                className='outline-none text-[20px]'
                                type='number'
                                id='from'
                                value={price.from}
                                onChange={e => setPrice(prev => ({ ...prev, from: e.target.value }))} />
                        </div>

                        <div className='flex items-center gap-2'>
                            <label htmlFor='to'>To</label>
                            <input
                                className='outline-none text-[20px]'
                                type='number'
                                id='to'
                                value={price.to}
                                onChange={e => setPrice(prev => ({ ...prev, to: e.target.value }))} />
                        </div>
                    </div>
                </div>}

            </div>}
        </div>
    )
}

export default memo(SearchItem)
