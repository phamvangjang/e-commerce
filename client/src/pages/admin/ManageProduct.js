import React, { memo, useCallback, useEffect, useState } from 'react'
import { CustomizeVarriants, InputForm, Pagination } from 'components'
import { useForm } from 'react-hook-form'
import { apiGetProducts, apiDeleteProduct } from 'apis'
import moment from 'moment'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import useDebounce from 'hooks/useDebounce'
import UpdateProduct from './UpdateProduct'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import icons from 'ultils/icons'

const { RiDeleteBin6Fill, FaEdit, BiSolidCustomize } = icons

const ManageProduct = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [params] = useSearchParams()
    const [products, setProducts] = useState(null)
    const [counts, setCounts] = useState(0)
    const [editProduct, setEditProduct] = useState(null)
    const [update, setUpdate] = useState(false)
    const [customizeVarriant, setCustomizeVarriant] = useState(null)
    const render = useCallback(() => {
        setUpdate(!update)
    })
    const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
    const handleSearchProduct = (data) => {
        console.log(data)
    }
    const fetchProducts = async (params) => {
        const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_LIMIT })
        if (response.success) {
            setCounts(response.counts)
            setProducts(response.products)
        }
    }

    const queryDebounce = useDebounce(watch('q'), 800)

    useEffect(() => {
        if (queryDebounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queryDebounce }).toString()
            })
        } else {
            navigate({
                pathname: location.pathname,
            })
        }
    }, [queryDebounce])

    useEffect(() => {
        const searchParams = Object.fromEntries([...params])

        fetchProducts(searchParams)
    }, [params, update])

    const handleDeleteProduct = (pid) => {
        Swal.fire({
            title: 'Warning!',
            text: 'Do you want delete this product?',
            icon: 'warning',
            showCancelButton: true
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiDeleteProduct(pid)
                if (response.success) toast.success(response.mes)
                else toast.error(response.mes)
                render()
            }
        })
    }
    // console.log(products)
    return (
        <div className='w-full flex flex-col gap-4 relative'>

            {editProduct && <div className='absolute inset-0 min-h-screen bg-gray-100 z-50'>
                <UpdateProduct
                    editProduct={editProduct}
                    render={render}
                    setEditProduct={setEditProduct}
                />
            </div>}

            {customizeVarriant && <div className='absolute inset-0 min-h-screen bg-gray-100 z-50'>
                <CustomizeVarriants
                    customizeVarriant={customizeVarriant}
                    render={render}
                    setCustomizeVarriant={setCustomizeVarriant}
                />
            </div>}

            <div className='h-[70px] w-full'></div>

            <div className='bg-gray-100 p-4 border-b w-full justify-between items-center border-gray-900 fixed top-0'>
                <h1 className='text-3xl font-bold tracking-tight'>Manage Products</h1>
            </div>

            <div className='flex w-full justify-end items-center px-4'>
                <form
                    className='w-[45%]'
                    onSubmit={handleSubmit(handleSearchProduct)}
                >
                    <InputForm
                        id='q'
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder='Search product by title, description...'
                    />
                </form>
            </div>

            <table className='table-auto border-collapse mx-4'>
                <thead>
                    <tr className='border bg-gray-700 text-white border-white'>
                        <th className='border border-gray-500 py-2'>Order</th>
                        <th className='border border-gray-500 py-2'>Thumb</th>
                        <th className='border border-gray-500 py-2'>Title</th>
                        <th className='border border-gray-500 py-2'>Brand</th>
                        <th className='border border-gray-500 py-2'>Category</th>
                        <th className='border border-gray-500 py-2'>Price</th>
                        <th className='border border-gray-500 py-2'>Quantity</th>
                        <th className='border border-gray-500 py-2'>Sold</th>
                        <th className='border border-gray-500 py-2'>Color</th>
                        <th className='border border-gray-500 py-2'>Rating</th>
                        <th className='border border-gray-500 py-2'>Varriants count</th>
                        <th className='border border-gray-500 py-2'>Update At</th>
                        <th className='border border-gray-500 py-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((el, idx) => (
                        <tr key={el._id}>
                            <td className='border border-gray-500 py-2 text-center'>{((+params.get('page') > 1
                                ? +params.get('page') - 1
                                : 0) * process.env.REACT_APP_LIMIT) + idx + 1}</td>
                            <td className='border border-gray-500 py-2 text-center'>
                                <img
                                    src={el.thumb}
                                    alt='thumb'
                                    className='w-12 h-12 object-cover'
                                />
                            </td>
                            <td className='border border-gray-500 py-2 text-center'>{el.title}</td>
                            <td className='border border-gray-500 py-2 text-center'>{el.brand}</td>
                            <td className='border border-gray-500 py-2 text-center'>{el.category}</td>
                            <td className='border border-gray-500 py-2 text-center'>{el.price}</td>
                            <td className='border border-gray-500 py-2 text-center'>{el.quantity}</td>
                            <td className='border border-gray-500 py-2 text-center'>{el.sold}</td>
                            <td className='border border-gray-500 py-2 text-center'>{el.color}</td>
                            <td className='border border-gray-500 py-2 text-center'>{el.totalRatings}</td>
                            <td className='border border-gray-500 py-2 text-center'>{el?.varriants?.length || 0}</td>
                            <td className='border border-gray-500 py-2 text-center'>{moment(el.updatedAt).format('DD/MM/YYYY')}</td>
                            <td className='border border-gray-500 py-2 text-center '>
                                <div className='flex gap-1 items-center justify-center'>
                                    <span
                                        onClick={() => setEditProduct(el)}
                                        className='text-orange-400 text-[20px]  hover:text-orange-700 hover:underline cursor-pointer px-1'>
                                        <FaEdit /></span>
                                    <span
                                        onClick={() => handleDeleteProduct(el._id)}
                                        className='text-orange-400 text-[20px]  hover:text-orange-700 hover:underline cursor-pointer px-1'>
                                        <RiDeleteBin6Fill /></span>
                                    <span
                                        onClick={() => setCustomizeVarriant(el)}
                                        className='text-orange-400 text-[20px]  hover:text-orange-700 hover:underline cursor-pointer px-1'>
                                        <BiSolidCustomize /></span>
                                </div>
                            </td>
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

export default memo(ManageProduct)
