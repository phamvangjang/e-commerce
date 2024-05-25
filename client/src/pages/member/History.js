import { apiGetUserOrders } from 'apis'
import { CustomSelect, InputForm, Pagination } from 'components'
import withBaseCompoment from 'hocs/withBaseCompoment'
import moment from 'moment'
import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import { statusOrder } from 'ultils/contants'

const History = ({ navigate, location }) => {
    const [params] = useSearchParams()
    const [orders, setOrders] = useState(null)
    const [counts, setCounts] = useState(0)
    const { register, formState: { errors }, watch, setValue } = useForm()
    const q = watch('q')
    const status = watch('status')
    const fetchOrders = async (params) => {
        const response = await apiGetUserOrders({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        })
        if (response.success) {
            setOrders(response.orders)
            setCounts(response.counts)
        }
    }

    useEffect(() => {
        const pr = Object.fromEntries([...params])
        fetchOrders(pr)
    }, [params])

    const handleSearchStatus = ({ value }) => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams({ status: value }).toString()
        })
    }
    return (
        <div
            className='w-full relative px-4'>
            <header
                className='text-3xl font-semibold py-4 border-b border-gray-500'>
                History
            </header>

            <div className='flex w-full justify-end items-center px-4'>
                <form
                    className='w-[45%] grid grid-cols-2 gap-4'>
                    <div className='col-span-1'>
                        <InputForm
                            id='q'
                            register={register}
                            errors={errors}
                            fullWidth
                            placeholder='Search order by status...'
                        />
                    </div>

                    {/* <div className='col-span-1 flex items-center'>
                        <CustomSelect
                            options={statusOrder}
                            value={status}
                            onChange={(val) => handleSearchStatus(val)}
                            wrapClassname='w-full'
                        />
                    </div> */}
                </form>
            </div>

            <table className='table-auto border-collapse px-2 w-full'>
                <thead>
                    <tr className='border bg-gray-700 text-white border-white'>
                        <th className='border border-gray-500 py-2'>#</th>
                        <th className='border border-gray-500 py-2'>Product</th>
                        <th className='border border-gray-500 py-2'>Total</th>
                        <th className='border border-gray-500 py-2'>Status</th>
                        <th className='border border-gray-500 py-2'>Create At</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map((el, idx) => (
                        <tr key={el._id}>
                            <td className='border border-gray-500 py-2 text-center'>{((+params.get('page') > 1
                                ? +params.get('page') - 1
                                : 0) * process.env.REACT_APP_LIMIT) + idx + 1}
                            </td>
                            <td className='max-w-[500px] border border-gray-500 py-2 text-center'>
                                <span className='grid grid-cols-2 items-start px-2'>
                                    {el.products?.map(item =>
                                        <span
                                            className='flex col-span-1 items-center gap-2'
                                            key={item._id}>
                                            <img
                                                src={item?.thumbnail}
                                                alt='thumb'
                                                className='w-8 h-8 rounded-md object-cover'
                                            />
                                            <span className='flex flex-col'>
                                                <span className='text-main text-sm'>{item?.title}</span>
                                                <span className='flex items-center text-xs gap-2'>
                                                    <span>Quantity: </span>
                                                    <span className='text-main'>{item?.quantity}</span>
                                                </span>
                                            </span>
                                        </span>)}
                                </span>
                            </td>
                            <td className='border border-gray-500 py-2 text-center'>{el.total + ' USD'}</td>
                            <td className='border border-gray-500 py-2 text-center'>{el.status}</td>
                            <td className='border border-gray-500 py-2 text-center'>{moment(el.createdAt)?.format('DD/MM/YYYY')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='w-full justify-end my-8 flex px-4'>
                <Pagination
                    totalCount={counts}
                />
            </div>
        </div>
    )
}

export default withBaseCompoment(History)
