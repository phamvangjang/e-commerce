import { Button, Product } from 'components'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'

const Wishlist = () => {
    const { current } = useSelector((s) => s.user)
    return (
        <div
            className='w-full relative px-4'>
            <header
                className='text-3xl font-semibold py-4 border-b border-gray-500'>
                My wishlist
            </header>
            <div className='p-4 w-full grid grid-cols-3 gap-4'>
                {current?.wishlist?.map((el) => (
                    <div
                        className='bg-white rounded-md drop-shadow flex flex-col pt-3 gap-3'
                        key={el._id}>
                        <Product
                            pid={el._id}
                            productData={el}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(Wishlist)
