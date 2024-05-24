import React, { memo } from 'react'

const History = () => {
    return (
        <div
            className='w-full relative px-4'>
            <header
                className='text-3xl font-semibold py-4 border-b border-gray-500'>
                History
            </header>
        </div>
    )
}

export default memo(History)
