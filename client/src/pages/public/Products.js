import React, { useEffect, useState, memo, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'
import { Breadcrumb, Product, SearchItem, InputSelect } from '../../components'
import { apiGetProducts } from '../../apis'
import Masonry from 'react-masonry-css'
import { sorts } from '../../ultils/contants'

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
};
const Products = () => {
    const navigate = useNavigate()
    const [activeClick, setActiveClick] = useState(false)
    const [products, setProducts] = useState(null)
    const [params] = useSearchParams()
    const [sort, setSort] = useState('')

    const fetchProductsByCategory = async (queries) => {
        const response = await apiGetProducts(queries)
        if (response.success) setProducts(response.products)
    }

    const { category } = useParams()
    useEffect(() => {
        let param = []
        for (let i of params.entries()) param.push(i)
        const queries = {}
        let priceQuery = {}
        for (let i of params) queries[i[0]] = i[1]

        if (queries.to && queries.from) {
            priceQuery = {
                $and: [
                    { price: { gte: queries.from } },
                    { price: { lte: queries.to } },
                ]
            }
            delete queries.price
        }
        if (queries.from) {
            queries.price = { gte: queries.from }
        }

        if (queries.to) {
            queries.price = { lte: queries.to }
        }

        delete queries.from
        delete queries.to
        const q = { ...priceQuery, ...queries }
        // console.log(q)
        fetchProductsByCategory(q)
    }, [params])

    const changeActiveFilter = useCallback((name) => {
        if (activeClick === name) setActiveClick(null)
        else setActiveClick(name)
    }, [activeClick])

    const changeValue = ((value) => {
        setSort(value)
    })

    useEffect(() => {
        navigate({
            pathname: `/${category}`,
            search: createSearchParams({ sort }).toString()
        })
    }, [sort])
    return (
        <div className='w-full'>
            <div className="h-[80px] flex justify-center items-center bg-gray-200">
                <div className="w-main flex flex-col gap-1">
                    <h3 className='font-semibold uppercase'>{category}</h3>
                    <Breadcrumb category={category} />
                </div>
            </div>

            <div className='w-main border p-4 flex justify-between mt-8 m-auto'>
                <div className='w-4/5 flex-auto flex flex-col gap-2'>
                    <span className='font-semibold'>Filter by</span>
                    <div className='flex items-center gap-4'>
                        <SearchItem
                            type='input'
                            name='price'
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                        />
                        <SearchItem
                            name='color'
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                        />
                    </div>
                </div>

                <div className='w-1/5 flex flex-col gap-3'>
                    <span className='font-semibold'>Sort by</span>
                    <div>
                        <InputSelect changeValue={changeValue} value={sort} option={sorts} />
                    </div>
                </div>
            </div>

            <div className='w-main mt-8 m-auto'>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column">
                    {products?.map(el => (
                        <Product
                            key={el._id}
                            pid={el.id}
                            productData={el}
                            normal={true}
                        />
                    ))}
                </Masonry>
            </div>

            <div className='w-full h-[500px]'></div>
        </div>
    )
}

export default memo(Products)