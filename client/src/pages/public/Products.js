import React, { useEffect, useState, memo, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Breadcrumb, Product, SearchItem } from '../../components'
import { apiGetProducts } from '../../apis'
import Masonry from 'react-masonry-css'

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
};
const Products = () => {
    const [activeClick, setActiveClick] = useState(false)
    const [products, setProducts] = useState(null)
    const fetchProductsByCategory = async (queries) => {
        const response = await apiGetProducts(queries)
        if (response.success) setProducts(response.products)
    }
    const { category } = useParams()
    useEffect(() => {
        fetchProductsByCategory()
    }, [])
    const changeActiveFilter = useCallback((name) => {
        if (activeClick === name) setActiveClick(null)
        else setActiveClick(name)
    }, [activeClick])
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
                <div className='w-1/5 flex-auto'>Sort</div>
            </div>

            <div className='w-main mt-8 m-auto'>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column">
                    {products?.map(el => (
                        <Product
                            key={el.id}
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