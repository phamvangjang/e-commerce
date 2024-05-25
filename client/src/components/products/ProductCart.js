import React, { memo } from "react";
import { renderStarFromNumber, formatMoney } from '../../ultils/helpers'
import withBaseCompoment from "hocs/withBaseCompoment";

const ProductCart = ({ image, title, totalRatings, price, pid, navigate, category }) => {
    return (
        <div
            onClick={(e) =>
                navigate(`/${category?.toLowerCase()}/${pid}/${title}`)}
            className="w-1/3 flex-auto px-[10px] mb-[20px] cursor-pointer">
            <div className='flex w-full border'>
                <img
                    src={image}
                    alt='product'
                    className='w-[120px] object-contain p-4'
                />
                <div className='flex flex-col gap-1 mt-[15px] items-start w-full text-xs'>
                    <span className='line-clamp-1 capitalize text-sm '>{title?.toLowerCase()}</span>
                    <span className='flex h-4'>{renderStarFromNumber(totalRatings, 14)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>

                    <span>{`${formatMoney(price)} VND`}</span>
                </div>
            </div>
        </div>

    )
}
export default withBaseCompoment(memo(ProductCart))