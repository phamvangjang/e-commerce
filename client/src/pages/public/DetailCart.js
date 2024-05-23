import { Breadcrumb, Button, OrderItem } from 'components'
import withBaseCompoment from 'hocs/withBaseCompoment'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { formatMoney } from 'ultils/helpers'
import path from 'ultils/path'

const DetailCart = ({ location }) => {
    const { currentCart } = useSelector(state => state.user)
    console.log(currentCart)
    return (
        <div className='w-full'>
            <div className="h-[80px] flex justify-center items-center bg-gray-200">
                <div className="w-main ">
                    <h3 className='mx-2 font-bold uppercase text-2xl'>My Cart</h3>
                    {/* <Breadcrumb
                        category={location?.pathname?.replace('/', ' ')?.split('-')?.join(' ')} /> */}
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
                        key={el?._id}
                        defaultQuantity={el?.quantity}
                        color={el?.color}
                        title={el?.title}
                        thumbnail={el.thumbnail}
                        price={el.price}
                        pid={el?.product?._id} />
                ))}
            </div>
            <div className='mb-12 w-main mx-auto flex flex-col justify-center items-end gap-3'>
                <span className='flex items-center gap-8 text-sm'>
                    <span>Subtotal: </span>
                    <span className='text-main font-bold'>{`${formatMoney(currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0))} VND`}</span>
                </span>
                <span className='text-xs italic'>Shipping, taxes, and discounts calculated at checkout.</span>
                <Button>
                    <Link 
                    target='_blank'
                    to={`/${path.CHECKOUT}`}>Checkout</Link>
                </Button>
            </div>
            <div className='h-[500px]'>

            </div>
        </div>

    )
}

export default withBaseCompoment(DetailCart)
