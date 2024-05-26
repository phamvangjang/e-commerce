import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from 'apis'
import moment from 'moment'
import { roles, blockStatus } from 'ultils/contants'
import { InputField, Pagination, InputForm, Select, Button } from 'components'
import useDebounce from 'hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import clsx from 'clsx'
import icons from 'ultils/icons'
import { FaBackspace } from "react-icons/fa";

const { RiDeleteBin6Fill, FaEdit } = icons

const ManageUser = () => {
    const { handleSubmit, register, formState: { errors }, reset } = useForm({
        email: '',
        firstname: '',
        lastname: '',
        role: '',
        phone: '',
        isBlocked: ''
    })

    const [queries, setQueries] = useState({
        q: ''
    })
    const [params] = useSearchParams()
    const [users, setUsers] = useState(null)
    const [editElm, setEditElm] = useState(null)
    const [update, setUpdate] = useState(false)

    const fetchUsers = async (params) => {
        const response = await apiGetUsers({ ...params, limit: process.env.REACT_APP_LIMIT })
        if (response.success) setUsers(response)

    }

    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])

    const queriesDebounce = useDebounce(queries.q, 800)

    useEffect(() => {
        const queries = Object.fromEntries([...params])
        if (queriesDebounce) queries.q = queriesDebounce
        fetchUsers(queries)
    }, [queriesDebounce, params, update])

    const handleUpdate = async (data) => {
        // console.log(data)
        const response = await apiUpdateUser(data, editElm._id)
        if (response.success) {
            setEditElm(null)
            render()
            toast.success(response.mes)
        } else toast.error(response.mes)
    }

    const handleDeleteUser = async (uid) => {
        Swal.fire({
            title: 'Warring',
            text: 'Are you sure delete this user?',
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteUser(uid)
                if (response.success) {
                    render()
                    toast.success(response.mes)
                } else toast.error(response.mes)
            }
        })

    }

    useEffect(() => {
        if (editElm) reset({
            role: editElm.role,
            status: editElm.isBlocked
        })
    }, [editElm])

    return (
        <div className={clsx('w-full', editElm && 'pl-16')}>
            <h1 className='h-[80px] flex justify-between items-center text-3xl font-bold px-4 border-b border-gray-900 '>
                <span>Manage User</span>
            </h1>
            <div className='w-full p-4'>
                <div className='flex justify-end py-4'>
                    <InputField
                        nameKey={'q'}
                        value={queries.q}
                        setValue={setQueries}
                        style='w-[500px] text-gray-900'
                        placeholder={'Search name or email user...'}
                        isHideLabel
                    />
                </div>

                <form onSubmit={handleSubmit(handleUpdate)}>
                    {editElm && <Button
                        type='submit'>
                        Update
                    </Button>}

                    <table className='table-auto mb-6 text-left w-full'>
                        <thead className='font-bold bg-gray-400 text-[13px] border border-gray-900 text-center'>
                            <tr className=''>
                                <th className='border border-gray-500 py-2'>#</th>
                                <th className='border border-gray-500 py-2'>Email</th>
                                <th className='border border-gray-500 py-2'>First name</th>
                                <th className='border border-gray-500 py-2'>Last name</th>
                                <th className='border border-gray-500 py-2'>Role</th>
                                <th className='border border-gray-500 py-2'>Phone</th>
                                <th className='border border-gray-500 py-2'>Status</th>
                                <th className='border border-gray-500 py-2'>CreateAt</th>
                                <th className='border border-gray-500 py-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.users?.map((el, idx) => (
                                <tr key={el._id} className='border border-gray-900 text-center'>
                                    <td className='py-2 border border-gray-500'>{idx + 1}</td>
                                    <td className='py-2 border border-gray-500'>
                                        {editElm?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                defaultValue={editElm?.email}
                                                fullWidth
                                                errors={errors}
                                                id={'email'}
                                                validate={{
                                                    require: true,
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "invalid email address"
                                                    }
                                                }}
                                            />
                                            : <span>{el.email}</span>}</td>
                                    <td className='py-2 border border-gray-500'>
                                        {editElm?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                defaultValue={editElm?.firstname}
                                                fullWidth
                                                errors={errors}
                                                id={'firstname'}
                                                validate={{ require: 'Require fill data' }}
                                            />
                                            : <span>{el.firstname}</span>}</td>
                                    <td className='py-2 border border-gray-500'>
                                        {editElm?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                defaultValue={editElm?.lastname}
                                                fullWidth
                                                errors={errors}
                                                id={'lastname'}
                                                validate={{ require: 'Require fill data' }}
                                            />
                                            : <span>{el.lastname}</span>}</td>
                                    <td className='py-2 border border-gray-500'>
                                        {editElm?._id === el._id
                                            ? <Select
                                                register={register}
                                                defaultValue={+el.role}
                                                fullWidth
                                                errors={errors}
                                                id={'role'}
                                                validate={{ require: 'Require fill data' }}
                                                options={roles}
                                            />
                                            : <span>{roles.find(role => +role.code === +el.role)?.value}</span>}</td>
                                    <td className='py-2 border border-gray-500'>
                                        {editElm?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                defaultValue={editElm?.mobile}
                                                fullWidth
                                                errors={errors}
                                                id={'mobile'}
                                                validate={{
                                                    require: 'Require fill data',
                                                    //pattern react hook for mobile 
                                                }}
                                            />
                                            : <span>{el.mobile}</span>}</td>
                                    <td className='py-2 border border-gray-500'>
                                        {editElm?._id === el._id
                                            ? <Select
                                                register={register}
                                                defaultValue={el.isBlocked}
                                                fullWidth
                                                errors={errors}
                                                id={'isBlocked'}
                                                validate={{ require: 'Require fill data' }}
                                                options={blockStatus}
                                            />
                                            : <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>}</td>
                                    <td className='py-2 border border-gray-500'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className='py-2 border border-gray-500'>
                                        <div className='flex gap-1 items-center justify-center'>
                                            {editElm?._id ?
                                                <span
                                                    onClick={() => setEditElm(null)}
                                                    className='text-orange-400 text-[20px]  hover:text-orange-700 cursor-pointer'><FaBackspace/></span>
                                                : <span
                                                    onClick={() => setEditElm(el)}
                                                    className='text-orange-400 text-[20px]  hover:text-orange-700 cursor-pointer'><FaEdit /></span>}
                                            <span
                                                onClick={() => handleDeleteUser(el._id)}
                                                className='text-orange-400 text-[20px]  hover:text-orange-700 cursor-pointer'><RiDeleteBin6Fill /></span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>

                <div className='w-full flex justify-end'>
                    <Pagination
                        totalCount={users?.counts}
                    />
                </div>
            </div>
        </div>
    )
}

export default ManageUser
