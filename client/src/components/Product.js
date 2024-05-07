import React, { useState } from "react";
import { formatMoney } from '../ultils/helpers'
import label from '../assets/label.png'
import label_blue from '../assets/label-blue.png'
import { renderStarFromNumber } from '../ultils/helpers'
import { SelectOption } from './'
import icons from "../ultils/icons";

const { FaEye, IoMdMenu, FaHeart } = icons

const Product = ({ productData, isNew }) => {
    const [isShowOption, setIsShowOption] = useState(false)
    return (
        <div className='w-full text-base px-[10px]'>
            <div
                className='w-full border p-[15px] flex flex-col items-center'
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsShowOption(true)
                }}
                onMouseLeave={e => {
                    e.stopPropagation()
                    setIsShowOption(false)
                }}
            >
                <div className='w-full relative'>
                    {isShowOption &&
                        <div className='absolute bottom-[10px] left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                            <SelectOption icon={<FaEye />} />
                            <SelectOption icon={<IoMdMenu />} />
                            <SelectOption icon={<FaHeart />} />
                        </div>
                    }
                    <img
                        src={productData?.thumb || 'https://mmi-global.com/wp-content/uploads/2020/05/default-product-image.jpg'}
                        alt="img product"
                        className='w-[274px] h-[274px] object-cover' />
                    <img
                        src={isNew ? label : label_blue}
                        alt=""
                        className='absolute top-[-18px] left-[-20px] w-[100px] h-[60px] object-contain'
                    />
                    <span className='font-bold top-[4px] left-[18px] absolute text-white'>{isNew ? 'New' : 'Hot'}</span>
                </div>
                <div className='flex flex-col gap-1 mt-[15px] items-start w-full'>
                    <span className='flex h-4'>{renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span className='line-clamp-1'>{productData?.title}</span>
                    <span>{`${formatMoney(productData?.price)} VND`}</span>
                </div>
            </div>
        </div>
    )
}

export default Product