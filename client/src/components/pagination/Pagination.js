import React, { useEffect } from 'react'
import usePagination from '../../hooks/usePagination'
import { PagiItem } from '..'
import { useSearchParams } from 'react-router-dom'


const Pagination = ({ totalCount }) => {
    const pagination = usePagination(totalCount, 3)
    const [params] = useSearchParams()
    useEffect(() => {
        const page = params.get('page') || 1
    })

    const range = () => {
        const currentPage = +params.get('page')
        const pageSize = +process.env.REACT_APP_PRODUCT_LIMIT || 10
        const start = ((currentPage - 1) * pageSize) + 1
        const end = Math.min(currentPage * pageSize, totalCount)

        return `${start} to ${end}`
    }
    return (
        <div className='flex w-main justify-between items-center'>
            {!+params.get('page') && <span className='text-sm italic'>{`Showing product from 1 to ${process.env.REACT_APP_PRODUCT_LIMIT || 10} of ${totalCount} products`}</span>} 

            {+params.get('page') && <span className='text-sm italic'>{`Show product from ${range()} of ${totalCount} products`}</span>}
            <div className='flex items-center'>
                {pagination?.map(el => (
                    <PagiItem key={el}>
                        {el}
                    </PagiItem>
                ))}
            </div>
        </div>
    )
}

export default Pagination
