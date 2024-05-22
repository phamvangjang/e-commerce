import { Breadcrumb, Button, OrderItem } from 'components'
import withBaseCompoment from 'hocs/withBaseCompoment'
import React from 'react'
import { useSelector } from 'react-redux'
import { formatMoney } from 'ultils/helpers'

const DetailCart = ({ location }) => {
    const { currentCart } = useSelector(state => state.user)

    return (
        <div className='w-full'>
            <div className="h-[80px] flex justify-center items-center bg-gray-200">
                <div className="w-main">
                    <h3 className='font-bold uppercase'>My Cart</h3>
                    <Breadcrumb
                        category={location?.pathname} />
                </div>
            </div>

            <div
                className='flex flex-col border mt-6 mb-6 w-main mx-auto'>
                <div
                    className='border-b w-main mx-auto font-bold py-3 grid grid-cols-10'>
                    <span
                        className='col-span-6 w-full text-center'>Product</span>
                    <span
                        className='col-span-1 w-full text-center'>Quantity</span>
                    <span
                        className='col-span-3 w-full text-center'>Price</span>
                </div>

                {currentCart?.map(el => (
                    <OrderItem
                        defaultQuantity={el?.quantity}
                        // handleChangeQuantities={handleChangeQuantities}
                        key={el?._id}
                        el={el} />
                ))}
            </div>
            <div className='mb-12 w-main mx-auto flex flex-col justify-center items-end gap-3'>
                <span className='flex items-center gap-8 text-sm'>
                    <span>Subtotal: </span>
                    <span className='text-main font-bold'>{`${formatMoney(currentCart?.reduce((sum, el) => +el?.price*el?.quantity + sum, 0))} VND`}</span>
                </span>
                <span className='text-xs italic'>Shipping, taxes, and discounts calculated at checkout.</span>
                <Button>Checkout</Button>
            </div>
            <div className='h-[500px]'>

            </div>
        </div>

    )
}

export default withBaseCompoment(DetailCart)
