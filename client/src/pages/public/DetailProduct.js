import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct } from "../../apis";
import { Breadcrumb, Button, SelectOption, SelectQuantity } from "../../components";
import Slider from "react-slick";
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, formatPrice, renderStarFromNumber } from "../../ultils/helpers";


const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const DetailProduct = () => {
    const { pid, title, category } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const fetchProductData = async () => {
        const response = await apiGetProduct(pid)
        console.log(response)
        if (response.success) setProduct(response.productDada)
    }

    useEffect(() => {
        if (pid) fetchProductData()
    }, [pid])

    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            return
        } else {
            setQuantity(number)
        }
    }, [quantity])

    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }, [quantity])
    return (
        <div className="w-full">
            <div className="h-[80px] flex justify-center items-center bg-gray-200">
                <div className="w-main">
                    <h3>{title}</h3>
                    <Breadcrumb title={title} category={category} />
                </div>
            </div>

            <div className="w-main m-auto mt-4 flex">
                <div className="flex-4 flex flex-col">
                    <div className="w-[460px] h-[460px] border">
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: 'Wristwatch by Ted Baker London',
                                isFluidWidth: true,
                                src: product?.thumb,
                            },
                            largeImage: {
                                src: product?.thumb,
                                width: 1800,
                                height: 1800
                            }
                        }} />
                    </div>

                    <div className="w-[460px]">
                        <Slider {...settings} className="w-full gap-2 mt-8 flex">
                            {product?.images?.map(el => (
                                <div key={el} className="">
                                    <img
                                        src={el}
                                        alt="img-product-other"
                                        className="p-3 w-[140px h-[140px] object-contain border border-x-2 border-y-2"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                <div className="flex-4 pr-[20px] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[30px] font-semibold">{`${formatMoney(formatPrice(product?.price))} VND`}</h2>
                        <span className="text-sm text-main">{`Kho: ${product?.quantity}`}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (<span key={index}>{el}</span>))}
                        <span className="text-sm text-main italic">{`(Đã bán: ${product?.sold} Cái)`}</span>
                    </div>
                    <ul className="list-square pl-4 text-sm text-gray-500">
                        {product?.description?.map(el =>
                        (
                            <li className="leading-6" key={el}>{el}</li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-6">
                        <SelectQuantity
                            quantity={quantity}
                            handleQuantity={handleQuantity}
                            handleChangeQuantity={handleChangeQuantity}
                        />
                        <Button fw>
                            ADD TO CART
                        </Button>
                    </div>
                </div>

                <div className="flex-2 border border-gray-300">Information</div>
            </div>
            <div className="h-[500px]"></div>
        </div>
    )
}
export default DetailProduct