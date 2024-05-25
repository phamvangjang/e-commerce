import React, { useState, useEffect, memo } from "react";
import icons from "../../ultils/icons";
import { apiGetProducts } from "../../apis/product";
import { renderStarFromNumber, formatMoney, secondsToHms } from '../../ultils/helpers';
import Countdown from "components/common/Countdown";
import moment from 'moment';
import { useSelector } from "react-redux";
import withBaseCompoment from "hocs/withBaseCompoment";
import { getDealDaily } from "store/products/productSlice";


const { FaStar, IoMdMenu } = icons

let idInterval
const DeadDaily = ({ dispatch }) => {
    // const [dealdaily, setDealdaily] = useState(null)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)
    const { dealDaily } = useSelector((s) => s.products)

    const fetchDealDaily = async () => {
        const response = await apiGetProducts({ limit: 20, sort: '-totalRatings' })
        if (response.success) {
            const pr = response.products[Math.round(Math.random() * 20)]
            dispatch(
                getDealDaily({ data: pr, time: Date.now() + 24 * 60 * 60 * 1000 })
            )


            // const today = `${moment().format('MM/DD/YYYY')} 5:00:00`
            // const seconds = new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000
            // const number = secondsToHms(seconds)
            // setHour(number.h)
            // setMinute(number.m)
            // setSecond(number.s)
        }
        // else {
        //     setHour(0)
        //     setMinute(59)
        //     setSecond(59)
        // }
    }
    // useEffect(() => {
    //     fetchDealDaily()
    // }, [])

    useEffect(() => {
        if (dealDaily?.time) {
            const deltalTime = dealDaily.time - Date.now()
            const number = secondsToHms(deltalTime)
            setHour(number.h)
            setMinute(number.m)
            setSecond(number.s)
        }
    }, [dealDaily])

    useEffect(() => {
        idInterval && clearInterval(idInterval)
        if (moment(moment(dealDaily?.time).format('MM/DD/YYYY')).isBefore(moment())) fetchDealDaily()
    }, [expireTime])
    useEffect(() => {
        idInterval = setInterval(() => {
            if (second > 0) setSecond(prev => prev - 1)
            else {
                if (minute > 0) {
                    setMinute(prev => prev - 1)
                    setSecond(59)
                } else {
                    if (hour > 0) {
                        setHour(prev => prev - 1)
                        setMinute(59)
                        setSecond(59)
                    } else {
                        setExpireTime(!expireTime)
                    }
                }
            }
        }, 1000)
        return () => {
            clearInterval(idInterval)
        }
    }, [second, minute, hour, expireTime])
    return (

        <div className='w-full border flex-auto'>
            <div className='flex items-center justify-between p-4 w-full'>
                <span className='flex-1 flex justify-center'><FaStar size={20} color="#DD1111" /></span>
                <span className='flex-8 font-semibold flex justify-center text-[20px] text-gray-700'>DEAL DAILY</span>
                <span className='flex-1'></span>
            </div>
            <div className='w-full flex flex-col items-center px-4 pt-8 gap-2'>
                <img
                    src={dealDaily?.data?.thumb || 'https://mmi-global.com/wp-content/uploads/2020/05/default-product-image.jpg'}
                    alt="img product"
                    className='w-full object-contain' />

                <span className='line-clamp-1 text-center'>{dealDaily?.data?.title}</span>
                <span className='flex h-4'>{renderStarFromNumber(dealDaily?.data?.totalRatings, 20)?.map((el, index) => (
                    <span key={index}>{el}</span>
                ))}</span>
                <span>{`${formatMoney(dealDaily?.data?.price)} VND`}</span>
            </div>
            <div className="px-4 mt-8">
                <div className='flex items-center justify-center gap-2 mb-4'>
                    <Countdown unit={'Hours'} number={hour} />
                    <Countdown unit={'Minutes'} number={minute} />
                    <Countdown unit={'Seconds'} number={second} />
                </div>
                <button
                    type="button"
                    className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-600 text-white font-medium py-2"
                >
                    <IoMdMenu />
                    <span>Option</span>

                </button>
            </div>
        </div>
    )
}
export default withBaseCompoment(memo(DeadDaily))