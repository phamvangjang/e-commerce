import React, { useCallback, useEffect, useState } from "react";
import { createSearchParams, useParams } from "react-router-dom";
import { apiGetProduct, apiGetProducts, apiUpdateCart } from "../../apis";
import { Breadcrumb, Button, SelectOption, SelectQuantity, ProductInformation, CustomSlider } from "../../components";
import Slider from "react-slick";
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, formatPrice, renderStarFromNumber } from "../../ultils/helpers";
import icons from "../../ultils/icons";
import DOMPurify from "dompurify";
import clsx from "clsx";
import { useSelector } from "react-redux";
import withBaseCompoment from "hocs/withBaseCompoment";
import Swal from "sweetalert2";
import path from "ultils/path";
import { toast } from "react-toastify";
import { getCurrent } from "store/user/asyncActions";

const { FaShieldAlt, FaTruck, FaReply, FaPhoneAlt, FaGift } = icons
const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const DetailProduct = ({ isQuickView, data, location, dispatch, navigate }) => {
    const { current } = useSelector(state => state.user)
    const [update, setUpdate] = useState(false)
    const [currentImage, setCurrenImage] = useState(null)
    const params = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProduct, setRelatedProduct] = useState(null)
    const [varriants, setVarriants] = useState(null)
    const [pid, setPid] = useState(null)
    const [category, setCategory] = useState(null)
    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        thumb: '',
        images: [],
        price: '',
        color: ''
    })

    useEffect(() => {
        if (data) {
            setPid(data.pid)
            setCategory(data.category)
        }
        else if (params && params.pid) {
            setPid(params.pid)
            setCategory(params.category)
        }
    }, [data, params])

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
        // console.log(response)
        if (response.success) setRelatedProduct(response.products)
    }

    useEffect(() => {
        if (varriants) {
            setCurrentProduct({
                title: product?.varriants?.find(el => el.sku === varriants)?.title,
                color: product?.varriants?.find(el => el.sku === varriants)?.color,
                price: product?.varriants?.find(el => el.sku === varriants)?.price,
                images: product?.varriants?.find(el => el.sku === varriants)?.images,
                thumb: product?.varriants?.find(el => el.sku === varriants)?.thumb,
            })
        }else{
            setCurrentProduct({
                title: product?.title,
                color: product?.color,
                price: product?.price,
                images: product?.images || [],
                thumb: product?.thumb,
            })
        }
    }, )

    useEffect(() => {
        if (pid) {
            fetchProductData()
            fetchProducts()
        }
        window.scrollTo(0, 0)
    }, [pid])

    useEffect(() => {
        if (pid) { fetchProductData() }
    }, [update])

    const rerender = useCallback(() => {
        setUpdate(!update)
    })

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

    const handleAddToCart = async () => {
        if (!current) return Swal.fire({
            title: 'Almost...',
            text: 'Please go to login page',
            icon: 'info',
            cancelButtonText: 'Not now',
            showCancelButton: true,
            confirmButtonText: 'Go login page'
        }).then(async (rs) => {
            if (rs.isConfirmed) navigate({
                pathname: `/${path.LOGIN}`,
                search: createSearchParams({ redirect: location.pathname }).toString()
            })
        })
        const response = await apiUpdateCart({
            pid,
            color: currentProduct.color || product?.color,
            quantity,
            price: currentProduct.price || product.price,
            thumbnail: currentProduct.thumb || product.thumb,
            title: currentProduct.title || product.title,
        })
        if (response.success) {
            toast.success(response.mes)
            dispatch(getCurrent())
        }
        else toast.error(response.mes)
    }
    // console.log(product)
    return (
        <div
            className="w-full ">
            {!isQuickView && <div className="h-[80px] flex justify-center items-center bg-gray-200">
                <div className="w-main">
                    <h3 className="font-bold uppercase">{currentProduct?.title || product?.title}</h3>
                    <Breadcrumb
                        title={currentProduct?.title || product?.title}
                        category={category} />
                </div>
            </div>}

            <div
                onClick={e => e.stopPropagation()}
                className={clsx("m-auto mt-4 flex bg-gray-50 gap-2",
                    isQuickView
                        ? 'w-fit p-6 rounded-md'
                        : 'w-main')}>
                <div className="flex-4 flex flex-col">
                    <div className="w-[460px] h-[460px] border">
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: '',
                                isFluidWidth: true,
                                src: currentProduct.thumb || currentImage,
                            },
                            largeImage: {
                                src: currentProduct.thumb || currentImage,
                                width: 1800,
                                height: 1800
                            }
                        }} />
                    </div>

                    <div className="w-[460px]">
                        <Slider {...settings} className="w-full gap-2 mt-8 flex">
                            {currentProduct.images.length === 0 && product?.images?.map(el => (
                                <div key={el} className="">
                                    <img
                                        onClick={e => handleClickImage(e, el)}
                                        src={el}
                                        alt="img-product-other"
                                        className="cursor-pointer p-3 w-[140px h-[140px] object-contain border border-x-2 border-y-2"
                                    />
                                </div>
                            ))}

                            {currentProduct.images.length > 0 && currentProduct?.images?.map(el => (
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
                    <div className={clsx("flex items-center justify-between", isQuickView && 'gap-2')}>
                        <h2
                            className="text-[30px] font-semibold">
                            {`${formatMoney(formatPrice(currentProduct.price || product?.price))} VND`}
                        </h2>
                        <span
                            className="text-sm text-main">
                            {`Inventory: ${product?.quantity}`}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (<span key={index}>{el}</span>))}
                        <span className="text-sm text-main italic">{`(Sold: ${product?.sold} Unit)`}</span>
                    </div>
                    <ul
                        className="list-square pl-4 text-sm text-gray-500">
                        {product?.description?.length > 1 && product.description?.map(el => (<li
                            className="leading-6"
                            key={el}>{el}</li>))}
                        {product?.description?.length === 1 && <div
                            className="text-sm line-clamp-[20]"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
                    </ul>
                    <div className="flex  gap-4 my-4">
                        <span className="font-bold">Color: </span>
                        <div className="flex flex-wrap gap-4 items-center w-full">
                            <div
                                onClick={() => setVarriants(null)}
                                className={clsx("cursor-pointer flex items-center gap-2 p-2 border",
                                    !varriants
                                    && 'border-red-500'
                                )}>
                                <img
                                    src={product?.thumb}
                                    alt="thumb"
                                    className="w-12 h-12 rounded-md object-cover"
                                />
                                <span className="flex flex-col">
                                    <span>{product?.color}</span>
                                    <span className="text-sm">{product?.price}</span>
                                </span>
                            </div>
                            {product?.varriants?.map(el => (
                                <div
                                    key={el.sku}
                                    onClick={() => setVarriants(el?.sku)}
                                    className={clsx("cursor-pointer flex items-center gap-2 p-2 border",
                                        varriants === el.sku
                                        && 'border-red-500'
                                    )}>
                                    <img
                                        src={el?.thumb}
                                        alt="thumb"
                                        className="w-8 h-8 rounded-md object-cover"
                                    />
                                    <span className="flex flex-col">
                                        <span>{el?.color}</span>
                                        <span className="text-sm">{el?.price}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-2 items-center">
                            <span className="uppercase font-bold">Quantity</span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                        </div>
                        <Button handleOnClick={handleAddToCart} fw>
                            ADD TO CART
                        </Button>
                    </div>
                </div>

                {!isQuickView && <div className="flex-2 ">
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
                </div>}
            </div>

            {!isQuickView && <div className="w-main m-auto mt-8">
                <ProductInformation
                    totalRatings={product?.totalRatings}
                    ratings={product?.ratings}
                    nameProduct={product?.title}
                    pid={product?._id}
                    rerender={rerender}
                />
            </div>}

            {!isQuickView &&
                <>
                    <div className="w-main m-auto">
                        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase">OTHER CUSTOMERS ALSO BUY:</h3>
                        <CustomSlider normal={true} products={relatedProduct} />
                    </div>

                    <div className="h-[500px]"></div>
                </>}
        </div>
    )
}
export default withBaseCompoment(DetailProduct)