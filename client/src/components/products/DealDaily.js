import React, { useState, useEffect, memo } from "react";
import icons from "../../ultils/icons";
import { apiGetProducts } from "../../apis/product";
import { renderStarFromNumber, formatMoney, secondsToHms } from '../../ultils/helpers';
import Countdown from "components/common/Countdown";
import moment from 'moment';


const { FaStar, IoMdMenu } = icons

let idInterval
const DeadDaily = () => {
    const [dealdaily, setDealdaily] = useState(null)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)

    const fetchDealDaily = async () => {
        const response = await apiGetProducts({ limit: 1, page: Math.round(Math.random() * 10), totalRatings: 5 })
        if (response.success) {
            setDealdaily(response.products[0])

            const today = `${moment().format('MM/DD/YYYY')} 5:00:00`
            const seconds = new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000
            const number = secondsToHms(seconds)
            // const h = 24 - new Date().getHours()
            // const m = 60 - new Date().getMinutes()
            // const s = 60 - new Date().getSeconds()
            setHour(number.h)
            setMinute(number.m)
            setSecond(number.s)
        } else {
            setHour(0)
            setMinute(59)
            setSecond(59)
        }
    }
    // useEffect(() => {
    //     fetchDealDaily()
    // }, [])

    useEffect(() => {
        idInterval && clearInterval(idInterval)
        fetchDealDaily()
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
                    src={dealdaily?.thumb || 'https://mmi-global.com/wp-content/uploads/2020/05/default-product-image.jpg'}
                    alt="img product"
                    className='w-full object-contain' />

                <span className='line-clamp-1 text-center'>{dealdaily?.title}</span>
                <span className='flex h-4'>{renderStarFromNumber(dealdaily?.totalRatings, 20)?.map((el, index) => (
                    <span key={index}>{el}</span>
                ))}</span>
                <span>{`${formatMoney(dealdaily?.price)} VND`}</span>
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
export default memo(DeadDaily)