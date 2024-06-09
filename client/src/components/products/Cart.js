import { apiRemoveCart } from 'apis';
import Button from 'components/buttons/Button';
import withBaseCompoment from 'hocs/withBaseCompoment';
import React, { memo } from 'react'
import { IoIosCloseCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { showCart } from 'store/app/appSlice';
import { getCurrent } from 'store/user/asyncActions';
import { formatMoney, formatPrice } from 'ultils/helpers';
import icons from 'ultils/icons';
import path from 'ultils/path';


const { RiDeleteBin6Fill } = icons
const Cart = ({ dispatch, navigate }) => {
    const { currentCart } = useSelector(state => state.user)
    const removeCart = async (pid, color) => {
        const response = await apiRemoveCart(pid, color)
        if (response.success) {
            toast.success(response.mes)
            dispatch(getCurrent())
        }
        else toast.error(response.mes)
    }

    return (
        <div
            onClick={e => e.stopPropagation()}
            className='w-[400px] h-screen overflow-y-auto bg-gray-900 text-gray-50 p-6 grid grid-rows-10'>
            <header className='border-b border-gray-400 flex justify-between items-center font-bold text-2xl row-span-1 h-full'>
                <span>Your cart</span>
                <span
                    onClick={() => dispatch(showCart())}
                    className='p-2 cursor-pointer'>
                    <IoIosCloseCircle size={24} />
                </span>
            </header>

            <section className='flex flex-col gap-3 row-span-6 h-full max-h-[full] overflow-y-auto py-3'>
                {!currentCart && <div className='text-sm italic'>Your cart is empty.</div>}
                {currentCart && currentCart?.map(el => (
                    <div
                        key={el._id}
                        className='flex justify-between items-center'
                    >
                        <div className='flex gap-2'>
                            <img
                                src={el?.thumbnail || el?.product?.thumb}
                                alt='thumb'
                                className='w-28 h-28 object-cover'
                            />

                            <div
                                className='flex flex-col gap-1'>
                                <span
                                    className='font-sm'>{el?.title}</span>
                                <span
                                    className='text-[10px]'>{el?.color}</span>
                                <span
                                    className='text-[10px]'>{`Quantity: ${el?.quantity}`}</span>
                                <span
                                    className='text-sm'>
                                    {`${formatMoney(formatPrice(el?.price || el?.product?.price))} VND`}</span>
                            </div>
                        </div>
                        <span
                            onClick={() => removeCart(el?.product?._id, el?.color)}
                            className='p-2 cursor-pointer hover:text-main'
                        ><RiDeleteBin6Fill size={24} /></span>
                    </div>
                ))}
            </section>

            <div className='row-span-3 h-full flex flex-col gap-4 justify-center'>
                <div
                    className='flex items-center my-4 justify-between pt-4 border-t'>
                    <span>Subtotal: </span>
                    <span>{`${formatMoney(formatPrice(currentCart?.reduce((sum, el) => sum + Number(el?.price) * el?.quantity, 0)))} VND`}</span>
                </div>

                <span
                    className='flex text-center italic text-sm text-gray-500'
                >Shipping, taxes, and discounts calculated at checkout.</span>
                <div className='flex justify-center'>
                    <Button
                        handleOnClick={() => {
                            dispatch(showCart())
                            navigate(`/${path.MEMBER}/${path.DETAIL_CART}`)
                        }}
                        style='rounded-none w-full py-3 bg-main'
                    >SHOPPING CART</Button>
                </div>
            </div>

            <div className='row-span-1'></div>
        </div>
    )
}

export default withBaseCompoment(memo(Cart))
