import React, { memo, useState } from "react";
import { formatMoney } from '../../ultils/helpers'
import label from '../../assets/label.png'
import label_blue from '../../assets/label-blue.png'
import { renderStarFromNumber } from '../../ultils/helpers'
import { SelectOption } from '../'
import icons from "../../ultils/icons";
import withBaseCompoment from "hocs/withBaseCompoment";
import { showModel } from "store/app/appSlice";
import { DetailProduct } from "pages/public";
import { apiUpdateCart } from "apis";
import { toast } from "react-toastify";
import { getCurrent } from "store/user/asyncActions";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import path from "ultils/path";
// import path from "../ultils/path";

const { FaEye, FaCartPlus, FaHeart, BsCartCheckFill } = icons

const Product = ({ productData, isNew, normal, navigate, dispatch }) => {
    const { current } = useSelector(state => state.user)

    const [isShowOption, setIsShowOption] = useState(false)

    const handleClickOptions = async (e, flag) => {
        e.stopPropagation()
        if (flag === 'CART') {
            // console.log(productData)
            if (!current) return Swal.fire({
                title: 'Almost...',
                text: 'Please go to login page',
                icon: 'info',
                cancelButtonText: 'Not now',
                showCancelButton: true,
                confirmButtonText: 'Go login page'
            }).then((rs) => {
                if (rs.isConfirmed) navigate(`/${path.LOGIN}`)
            })
            const response = await apiUpdateCart({ pid: productData._id, color: productData.color })
            if (response.success) {
                toast.success(response.mes)
                dispatch(getCurrent())
            }
            else toast.error(response.mes)
        }
        if (flag === 'WISHLIST') console.log('WISHLIST')
        if (flag === 'QUICK_VIEW') {
            dispatch(showModel({
                isShowModel: true,
                modelChildren:
                    <DetailProduct
                        data={{ pid: productData?._id, category: productData?.category }}
                        isQuickView />
            }))
        }
    }

    return (
        <div className='w-full text-base px-[10px]'>
            <div
                className='w-full border p-[15px] flex flex-col items-center'
                onClick={e => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
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
                            <span
                                title="Quick View"
                                onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}
                            >
                                <SelectOption icon={<FaEye />} />
                            </span>
                            
                            {current?.cart?.some(el => el.product === productData._id)
                                ? <span
                                    title="Added to cart"
                                    // onClick={(e) => handleClickOptions(e, 'CART')}
                                >
                                    <SelectOption icon={<BsCartCheckFill color="green" />} />
                                </span>
                                : <span
                                    title="Add to cart"
                                    onClick={(e) => handleClickOptions(e, 'CART')}
                                >
                                    <SelectOption icon={<FaCartPlus />} />
                                </span>}
                            <span
                                title="Add your wish list"
                                onClick={(e) => handleClickOptions(e, 'WISHLIST')}
                            >
                                <SelectOption icon={<FaHeart />} />
                            </span>
                        </div>
                    }
                    <img
                        src={productData?.thumb || 'https://mmi-global.com/wp-content/uploads/2020/05/default-product-image.jpg'}
                        alt="img product"
                        className='w-[274px] h-[274px] object-cover' />
                    {!normal &&
                        <>
                            <img
                                src={isNew ? label : label_blue}
                                alt=""
                                className='absolute top-[-18px] left-[-20px] w-[100px] h-[60px] object-contain'
                            />
                            <span className='font-bold top-[4px] left-[18px] absolute text-white'>{isNew ? 'New' : 'Hot'}</span>
                        </>
                    }
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

export default withBaseCompoment(memo(Product))