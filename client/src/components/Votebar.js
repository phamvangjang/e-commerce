import React, { memo, useRef, useEffect } from 'react'
import icons from '../ultils/icons'

const { FaStar } = icons

const Votebar = ({ number, ratingCount, ratingTotal }) => {
    const percentRef = useRef()
    useEffect(() => {
        percentRef.current.style.cssText = `right: ${100 - Math.round(ratingCount * 100 / ratingTotal)}%`
    }, [ratingCount, ratingTotal])
    return (
        <div className='flex items-center gap-2 text-gray-500'>
            <div className='justify-center flex items-center gap-1 text-sm flex-1'>
                <span>{number}</span>
                <FaStar color='orange' />
            </div>
            <div className='flex-7'>
                <div className='relative w-full h-[6px] bg-gray-300 rounded-l-full rounded-r-full'>
                    <div ref={percentRef} className='absolute inset-0 bg-red-500 right-5'></div>
                </div>
            </div>
            <div className='flex-2 justify-end flex text-xs text-gray-500'>{`${ratingCount || 0} reviewers`}</div>
        </div>
    )
}

export default memo(Votebar)
