import React, { memo } from 'react'
import usePagination from '../../hooks/usePagination'
import { PagiItem } from '..'
import { useSearchParams } from 'react-router-dom'


const Pagination = ({ totalCount }) => {
    const [params] = useSearchParams()
    const pagination = usePagination(totalCount, +params.get('page') || 1)
    // useEffect(() => {
    //     const page = params.get('page') || 1
    // })

    const range = () => {
        const currentPage = +params.get('page')
        const pageSize = Math.min(+process.env.REACT_APP_LIMIT, totalCount) || 10
        const start = Math.min(((currentPage - 1) * pageSize) + 1, totalCount)
        const end = Math.min(currentPage * pageSize, totalCount)

        return `${start} to ${end}`
    }
    return (
        <div className='flex w-full justify-between items-center'>
            {!+params.get('page')
                ? <span className='text-sm italic'>{`Showing item from ${Math.min(totalCount, 1)} to ${Math.min(+process.env.REACT_APP_LIMIT, totalCount)} of ${totalCount} items`}</span>
                : ''}

            {+params.get('page')
                ? <span className='text-sm italic'>{`Show product from ${range()} of ${totalCount} products`}</span>
                : ''}
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

export default memo(Pagination)
