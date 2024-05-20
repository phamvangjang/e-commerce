import { Breadcrumb, SelectQuantity } from 'components'
import withBaseCompoment from 'hocs/withBaseCompoment'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { formatMoney, formatPrice } from 'ultils/helpers'

const DetailCart = ({ location }) => {
    const { current } = useSelector(state => state.user)
    const [quantity, setQuantity] = useState(0)
    const handleQuantity = (number) => {
        if (+number > 1) setQuantity(number)
    }
    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }, [quantity])
    return (
        <div className='w-full'>
            <div className="h-[80px] flex justify-center items-center bg-gray-200">
                <div className="w-main">
                    <h3 className='font-bold uppercase'>Your Cart</h3>
                    <Breadcrumb
                        category={location.pathmane} />
                </div>
            </div>

            <div
                className='w-main mx-auto font-bold border mt-4 py-3 grid grid-cols-10'>
                <span
                    className='col-span-6 w-full text-center'>Product</span>
                <span
                    className='col-span-1 w-full text-center'>Quantity</span>
                <span
                    className='col-span-3 w-full text-center'>Price</span>
            </div>

            {current?.cart?.map(el => (
                <div
                    key={el._id}
                    className='w-main mx-auto font-bold border py-3 grid grid-cols-10'>
                    <span
                        className='col-span-6 w-full text-center'>
                        <div className='flex gap-2'>
                            <img
                                src={el?.product?.thumb}
                                alt='thumb'
                                className='w-28 h-28 object-cover'
                            />

                            <div className='flex flex-col items-start justify-center gap-3'>
                                <span className='font-sm'>{el?.product?.title}</span>
                                <span className='text-[10px]'>{el?.color}</span>
                            </div>
                        </div>
                    </span>
                    <span
                        className='col-span-1 w-full text-center'>
                        <div className='flex items-center h-full'>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                        </div>
                    </span>
                    <span className='col-span-3 w-full text-center  flex flex-col items-center justify-center h-full'>
                        <span
                            className='text-lg'>{`${formatMoney(formatPrice(el?.product?.price))} VND`}</span>
                    </span>
                </div>
            ))}
        </div>
    )
}

export default withBaseCompoment(DetailCart)
