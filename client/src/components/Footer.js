import React, { memo } from 'react'
import icons from '../ultils/icons'

const { MdEmail, FaPhoneAlt, FaLocationDot } = icons

const Footer = () => {
    return (
        <div className='w-full '>
            <div className='h-[100px] bg-main w-full flex items-center justify-center'>
                <div className='w-main flex items-center justify-between'>
                    <div className='flex flex-col flex-1'>
                        <span className='text-[20px] text-gray-200'>SIGN UP TO NEWSLETTER</span>
                        <small className='text-[13px] text-gray-400'>Subscribe now and receive weekly newsletter</small>
                    </div>
                    <div className='flex-1 flex items-center'>
                        <input
                            className='p-4 rounded-l-full w-full bg-[#f04444] outline-none text-gray-100 placeholder:text-sm placeholder:text-gray-200 placeholder:italic placeholder:opacity-50'
                            type='text'
                            name='' id=''
                            placeholder='Email address' />

                        <div className='h-[56px] w-[56px] bg-[#f04444] rounded-r-full flex items-center justify-normal text-white'>
                            <MdEmail size={24} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-[400px] bg-[#191919] w-full flex items-center justify-center text-white text-[13px]'>
                <div className='w-main flex'>
                    <div className='flex-2 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-4 border-main pl-[15px] uppercase'>about us</h3>
                        <span>
                            <span>Address: </span>
                            <span className='opacity-70'>474 Ontario St Toronto, ON M4X 1M7 Canada</span>
                        </span>
                        <span>
                            <span>Phone: </span>
                            <span className='opacity-70'>(+1234)56789xxx</span>
                        </span>
                        <span>
                            <span>Mail: </span>
                            <span className='opacity-70'>giangphamvan48@gmail.com</span>
                        </span>

                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-4 border-main pl-[15px] uppercase'>information</h3>
                        <span className='opacity-70'>Typography</span>
                        <span className='opacity-70'>Gallery</span>
                        <span className='opacity-70'>Store Location</span>
                        <span className='opacity-70'>Today's Deals</span>
                        <span className='opacity-70'>Contact</span>
                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-4 border-main pl-[15px] uppercase'>who we are</h3>
                        <span className='opacity-70'>Help</span>
                        <span className='opacity-70'>Free Shipping</span>
                        <span className='opacity-70'>FAQs</span>
                        <span className='opacity-70'>Return & Exchange</span>
                        <span className='opacity-70'>Testimonials</span>
                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-4 border-main pl-[15px] uppercase'>#DIGITALWORLDSTORE</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Footer)
