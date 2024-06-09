import SelectQuantity from 'components/common/SelectQuantity'
import withBaseCompoment from 'hocs/withBaseCompoment'
import React, { useEffect, useState } from 'react'
import { updateCart } from 'store/user/userSlice'
import { formatMoney, formatPrice } from 'ultils/helpers'

const OrderItem = ({ dispatch, color, defaultQuantity=1 , price, title, thumbnail, pid }) => {
    const [quantity, setQuantity] = useState(() => defaultQuantity)
    const handleQuantity = (number) => {
        if (+number > 1) setQuantity(number)
    }
    const handleChangeQuantity = (flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }

    useEffect(() => {
        dispatch(updateCart({
            pid,
            quantity,
            color,
        }))
    }, [quantity])
    return (
        <div
            className='w-full mx-auto font-bold py-10 grid grid-cols-10'>
            <span
                className='col-span-6 w-full text-center'>
                <div className='flex gap-2'>
                    <img
                        src={thumbnail}
                        alt='thumb'
                        className='w-28 h-28 object-cover'
                    />

                    <div className='flex flex-col items-start justify-center gap-3'>
                        <span className='font-sm'>{title}</span>
                        <span className='text-[10px]'>{color}</span>
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
                    className='text-lg'>{`${formatMoney(formatPrice(price * quantity))} VND`}</span>
            </span>
        </div>
    )
}

export default withBaseCompoment(OrderItem)
