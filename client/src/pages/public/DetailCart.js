import { Breadcrumb, Button, OrderItem } from 'components'
import withBaseCompoment from 'hocs/withBaseCompoment'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, createSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { formatMoney } from 'ultils/helpers'
import path from 'ultils/path'

const DetailCart = ({ location, navigate }) => {
    const { currentCart, current } = useSelector(state => state.user)

    const handleSubmit = () => {
        if (!current?.address) return Swal.fire({
            icon: 'info',
            title: 'Almost!',
            text: 'Please update your address before checkout',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Go update',
            cancelButtonText: 'Cancle',
        }).then((result) => {
            if (result.isConfirmed) navigate({
                pathname: `/${path.MEMBER}/${path.PERSONAL}`,
                search: createSearchParams({ redirect: location.pathname }).toString()
            })
        })
        else window.open(`/${path.CHECKOUT}`, '_blank')
    }
    // console.log(currentCart)
    return (
        <div className='w-full relative px-4'>
            <header className="text-3xl font-semibold py-4 border-b border-gray-500">
                My Cart
            </header>

            <div
                className='flex flex-col border mt-6 mb-6 w-full mx-auto'>
                <div
                    className='border-b w-full mx-auto font-bold py-3 grid grid-cols-10'>
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
            <div className='mb-12 w-full mx-auto flex flex-col justify-center items-end gap-3'>
                <span className='flex items-center gap-8 text-sm'>
                    <span>Subtotal: </span>
                    <span className='text-main font-bold'>{`${formatMoney(currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0))} VND`}</span>
                </span>
                <span className='text-xs italic'>Shipping, taxes, and discounts calculated at checkout.</span>
                <Button
                    handleOnClick={handleSubmit}>Checkout
                    {/* <Link 
                    target='_blank'
                    to={`/${path.CHECKOUT}`}>Checkout</Link> */}
                </Button>
            </div>
        </div>

    )
}

export default withBaseCompoment(DetailCart)
