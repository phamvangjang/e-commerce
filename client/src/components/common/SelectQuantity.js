import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {

    return (
        <div className='flex items-center'>
            <span onClick={() => handleChangeQuantity('minus')} className='cursor-pointer p-2 border-r border-black text-[30px]'>-</span>
            <input
                className='py-2 outline-none w-[50px] text-center text-black'
                type='text'
                value={quantity}
                onChange={e => handleQuantity(e.target.value)} />
            <span onClick={() => handleChangeQuantity('plus')} className='cursor-pointer p-2 border-l border-black text-[30px]'>+</span>
        </div>
    )
}

export default memo(SelectQuantity)
