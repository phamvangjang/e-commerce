import React, { useEffect, useState } from 'react';
import { apiGetProducts } from '../../apis/product';
// import { Product, CustomSlider } from './';
import Product from './Product';
import CustomSlider from 'components/common/CustomSlider';
import { getNewProducts } from '../../store/products/asynsActions'
import { useDispatch, useSelector } from 'react-redux';


const tabs = [
    { id: 1, name: 'best sellers' },
    { id: 2, name: 'news arrivals' },
]

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null)
    const [activedTab, setActivedTab] = useState(1)
    const [products, setProducts] = useState(null)
    const dispatch = useDispatch()
    const {newProducts} = useSelector(state => state.products)
    // const [newProducts] = useState(null)

    const fetchProducts = async () => {

        const response = await apiGetProducts({ sort: '-sold' })
        if (response.success) {
            setBestSellers(response.products)
            setProducts(response.products)
        }

    }

    useEffect(() => {
        fetchProducts()
        dispatch(getNewProducts())
    }, [])

    useEffect(() => {
        if (activedTab === 1) setProducts(bestSellers)
        if (activedTab === 2) setProducts(newProducts)
    }, [activedTab])
    return (
        <div>
            <div className='flex text-[20px] gap-8 pb-4 border-b-2 border-main'>
                {tabs.map(el => (
                    <span
                        key={el.id}
                        pid={el.id}
                        className={`font-semibold uppercase cursor-pointer border-r text-gray-300 ${activedTab === el.id ? 'text-gray-900' : ''}`}
                        onClick={() => setActivedTab(el.id)}
                    >{el.name}</span>
                ))}
            </div>
            <div className='mt-4 mx-[-10px]'>
                <CustomSlider products={products} activedTab={activedTab} />
            </div>
            <div className='w-full flex gap-4 mt-8'>
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
                    alt="banner2"
                    className='flex-1 object-contain' />

                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
                    alt="banner1"
                    className='flex-1 object-contain' />
            </div>
        </div>
    )
}

export default BestSeller