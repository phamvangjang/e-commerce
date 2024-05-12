import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct, apiGetProducts } from "../../apis";
import { Breadcrumb, Button, SelectOption, SelectQuantity, ProductInformation, CustomSlider } from "../../components";
import Slider from "react-slick";
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, formatPrice, renderStarFromNumber } from "../../ultils/helpers";
import icons from "../../ultils/icons";

const { FaShieldAlt, FaTruck, FaReply, FaPhoneAlt, FaGift } = icons
const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const DetailProduct = () => {
    const [currentImage, setCurrenImage] = useState(null)
    const { pid, title, category } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProduct, setRelatedProduct] = useState(null)
    const fetchProductData = async () => {
        const response = await apiGetProduct(pid)
        // console.log(response)
        if (response.success) {
            setProduct(response.productDada)
            setCurrenImage(response.productDada?.thumb)
        }
    }

    const fetchProducts = async () => {
        const response = await apiGetProducts({ category })
        console.log(response)
        if (response.success) setRelatedProduct(response.products)
    }

    useEffect(() => {
        if (pid) {
            fetchProductData()
            fetchProducts()
        }
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

    const handleClickImage = (e, el) => {
        e.stopPropagation()
        setCurrenImage(el)
    }
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
                                alt: '',
                                isFluidWidth: true,
                                src: currentImage,
                            },
                            largeImage: {
                                src: currentImage,
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
                                        onClick={e => handleClickImage(e, el)}
                                        src={el}
                                        alt="img-product-other"
                                        className="cursor-pointer p-3 w-[140px h-[140px] object-contain border border-x-2 border-y-2"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                <div className="flex-4 pr-[20px] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[30px] font-semibold">{`${formatMoney(formatPrice(product?.price))} VND`}</h2>
                        <span className="text-sm text-main">{`Inventory: ${product?.quantity}`}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (<span key={index}>{el}</span>))}
                        <span className="text-sm text-main italic">{`(Sold: ${product?.sold} Unit)`}</span>
                    </div>
                    <ul className="list-square pl-4 text-sm text-gray-500">
                        {product?.description?.map(el =>
                        (
                            <li className="leading-6" key={el}>{el}</li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-2 items-center">
                            <span className="uppercase font-bold">Quantity</span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                        </div>
                        <Button fw>
                            ADD TO CART
                        </Button>
                    </div>
                </div>

                <div className="flex-2 ">
                    <ul>
                        <li className="mb-3 flex items-center gap-1 p-3 border border-color-[#ebebeb]">
                            <div className="rounded-full p-2 bg-gray-900"><FaShieldAlt size={14}
                                color="#fff" /></div>
                            <div className="flex flex-col items-start">
                                <span className="text-[14px] text-gray-700">Guarantee</span>
                                <span className="text-[12px] text-gray-400">Quality Checked</span>
                            </div>
                        </li>

                        <li className="mb-3 flex items-center gap-1 p-3 border border-color-[#ebebeb]">
                            <div className="rounded-full p-2 bg-gray-900"><FaTruck size={14}
                                color="#fff" /></div>
                            <div className="flex flex-col items-start">
                                <span className="text-[14px] text-gray-700">Free Shipping</span>
                                <span className="text-[12px] text-gray-400">Free On All Products</span>
                            </div>
                        </li>

                        <li className="mb-3 flex items-center gap-1 p-3 border border-color-[#ebebeb]">
                            <div className="rounded-full p-2 bg-gray-900"><FaGift size={14}
                                color="#fff" /></div>
                            <div className="flex flex-col items-start">
                                <span className="text-[14px] text-gray-700">Special Gift Cards</span>
                                <span className="text-[12px] text-gray-400">Special Gift Cards</span>
                            </div>
                        </li>

                        <li className="mb-3 flex items-center gap-1 p-3 border border-color-[#ebebeb]">
                            <div className="rounded-full p-2 bg-gray-900"><FaReply size={14}
                                color="#fff" /></div>
                            <div className="flex flex-col items-start">
                                <span className="text-[14px] text-gray-700">Free Return</span>
                                <span className="text-[12px] text-gray-400">Within 7 Days</span>
                            </div>
                        </li>

                        <li className="mb-3 flex items-center gap-1 p-3 border border-color-[#ebebeb]">
                            <div className="rounded-full p-2 bg-gray-900"><FaPhoneAlt size={14}
                                color="#fff" /></div>
                            <div className="flex flex-col items-start">
                                <span className="text-[14px] text-gray-700">Consultancy</span>
                                <span className="text-[12px] text-gray-400">Lifetime 24/7/356</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="w-main m-auto mt-8">
                <ProductInformation totalRatings={product?.totalRatings} totalCount={18}/>
            </div>
            <div className="w-main m-auto">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase">OTHER CUSTOMERS ALSO BUY:</h3>
                <CustomSlider normal={true} products={relatedProduct} />
            </div>
            <div className="h-[500px]"></div>
        </div>
    )
}
export default DetailProduct