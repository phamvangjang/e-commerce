import React, { useEffect, useState } from 'react'
import payment from '../../assets/payment.svg'
import { useSelector } from 'react-redux'
import { formatMoney, formatPrice } from 'ultils/helpers'
import { Congratulations, Paypal } from 'components'
import withBaseCompoment from 'hocs/withBaseCompoment'
import { getCurrent } from 'store/user/asyncActions'

const Checkout = ({ dispatch, navigate }) => {
    const { currentCart, current } = useSelector(state => state.user)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        if (isSuccess) dispatch(getCurrent())
    }, [isSuccess])
    return (
        <div className='w-full p-8 grid grid-cols-10 gap-6 h-full max-h-screen overflow-y-auto'>
            {isSuccess && <Congratulations />}
            <div className='w-full flex items-center col-span-4'>
                <img
                    src={payment}
                    alt='payment'
                    className='h-[70%] object-contain'
                />
            </div>

            <div className='w-full flex flex-col justify-center col-span-6 gap-6 '>
                <h2 className='mb-6 text-3xl font-bold'>Checkout your order</h2>
                <div className='flex w-full gap-6'>
                    <div className='flex-1'>
                        <table className='table-auto h-fit'>
                            <thead>
                                <tr className='border bg-gray-200'>
                                    <th className='text-start p-2'>Product</th>
                                    <th className='text-center p-2'>Quantity</th>
                                    <th className='text-end p-2'>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCart?.map(el => (<tr className='border' key={el._id}>
                                    <td className='text-start p-2'>{el?.title}</td>
                                    <td className='text-center p-2'>{el?.quantity}</td>
                                    <td className='text-end p-2'>{`${formatMoney(formatPrice(el?.price))} VND`}</td>
                                </tr>))}
                            </tbody>
                        </table>
                    </div>

                    <div className='flex-1 flex flex-col justify-between gap-10'>

                        <div className='flex flex-col gap-6'>
                            <span className='flex items-center gap-8 text-sm'>
                                <span className='font-medium'>Subtotal: </span>
                                <span className='text-main font-bold'>{`${formatMoney(currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0))} VND`}</span>
                            </span>

                            <span className='flex items-center gap-8 text-sm'>
                                <span className='font-medium'>Address: </span>
                                <span className='text-main font-bold'>{current?.address}</span>
                            </span>
                        </div>

                        <div className='w-full'>
                            <Paypal
                                payload={{
                                    products: currentCart,
                                    total: Math.round(currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0) / 24000),
                                    address: current?.address
                                }}
                                setIsSuccess={setIsSuccess}
                                amount={Math.round(currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0) / 24000)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withBaseCompoment(Checkout)
