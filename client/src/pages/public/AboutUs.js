import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router-dom'
import { aboutUs } from 'ultils/contants'
import icons from 'ultils/icons'
import image from '../../assets/digital_marketingSM_large.png'

const { MdArrowForwardIos } = icons

const AboutUs = () => {
    return (
        <div className={clsx("w-full ")}>
            <div className="h-[80px] flex justify-center items-center bg-gray-200">
                <div
                    className="w-main flex flex-col justify-center gap-1">
                    <h3 className="font-bold uppercase">about us</h3>
                    <div className='flex items-center gap-1'>
                        <Link to={`${'/'}`} className='hover:text-main uppercase'>home</Link>
                        <span ><MdArrowForwardIos /></span>
                        <span className='uppercase'>about us</span>
                    </div>
                </div>
            </div>

            <div className='flex items-center w-main mx-auto'>
                <div className='flex-5  flex-col gap-3 items-center justify-center text-sm pl-4 text-gray-500'>

                    <div className='text-sm my-2'>A great About Us page helps builds trust between you and your customers. The more content you provide about you and your business, the more confident people will be when purchasing from your store.</div>

                    <ul className="list-square pl-4 text-sm flex flex-col gap-2">
                        {aboutUs.map(el => (
                            <li className="leading-6">{el.text}</li>
                        ))}
                    </ul>

                    <div className='text-sm my-2'>To edit the content on this page, go to the Pages section of your Shopify admin.</div>
                </div>
                <div className='flex-5 flex items-center justify-center'>
                    <img src={image} className='object-contain'/>
                </div>
            </div>
        </div>
    )
}

export default AboutUs
