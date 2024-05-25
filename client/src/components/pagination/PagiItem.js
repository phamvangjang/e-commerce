import React from 'react'
import clsx from 'clsx'
import { useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom'

const PagiItem = ({ children }) => {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const location = useLocation()

    const handlePagination = () => {
        // let param = []
        // for (let i of params.entries()) param.push(i)
        // const queries = {}
        // for (let i of param) queries[i[0]] = i[1]
        const queries = Object.fromEntries([...params])
        if (Number(children)) queries.page = children
        navigate({
            pathname: location.pathname,
            // pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })
        // console.log(queries)
    }
    return (
        <button
            type='button'
            disabled={!Number(children)}
            onClick={handlePagination}
            className={clsx('w-10 h-10 flex justify-center p-4  pb-4', !Number(children) && 'items-start ', Number(children) && 'items-center hover:rounded-full hover:bg-gray-400', +params.get('page') === +children && 'rounded-full bg-slate-400', !+params.get('page') && +children === 1 && 'rounded-full bg-slate-400')}>
            {children}
        </button>
    )
}

export default PagiItem
