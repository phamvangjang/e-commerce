import withBaseCompoment from 'hocs/withBaseCompoment';
import React, { memo } from 'react'
import { IoIosCloseCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import { showCart } from 'store/app/appSlice';
import { formatMoney, formatPrice } from 'ultils/helpers';

const Cart = ({ dispatch }) => {
    const { current } = useSelector(state => state.user)
    console.log(current)
    return (
        <div
            onClick={e => e.stopPropagation()}
            className='w-[400px] h-screen bg-gray-950 text-gray-50 p-6 grid grid-rows-10'>
            <header className='border-b border-gray-400 flex justify-between items-center font-bold text-2xl row-span-1 h-full'>
                <span>Your cart</span>
                <span
                    onClick={() => dispatch(showCart())}
                    className='p-2 cursor-pointer'>
                    <IoIosCloseCircle size={24} />
                </span>
            </header>
            <section className='flex flex-col gap-3 row-span-6 h-full max-h-full overflow-y-auto py-3'>
                {!current?.cart && <div className='text-sm italic'>Your cart is empty.</div>}
                {current?.cart && current?.cart?.map(el => (
                    <div
                        key={el._id}
                        className='flex gap-2'
                    >
                        <img
                            src={el?.product?.thumb}
                            alt='thumb'
                            className='w-16 h-16 object-cover'
                        />

                        <div className='flex flex-col gap-1'>
                            <span className='font-bold'>{el?.product?.title}</span>
                            <span className='text-xs'>{el?.color}</span>
                            <span className='text-base'>{`${formatMoney(formatPrice(el?.product?.price))} VND`}</span>
                        </div>
                    </div>
                ))}
            </section>
            <div className='row-span-3 h-full '>
                check out
            </div>
        </div>
    )
}

export default withBaseCompoment(memo(Cart))
