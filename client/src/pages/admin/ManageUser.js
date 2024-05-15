import React, { useEffect, useState } from 'react'
import { apiGetUsers } from 'apis'
import { roles } from 'ultils/contants'
import moment from 'moment'

const ManageUser = () => {
    const [users, setUsers] = useState(null)
    const fetchUsers = async (params) => {
        const response = await apiGetUsers(params)
        if (response.success) setUsers(response)
        console.log(response)
    }
    useEffect(() => {
        fetchUsers()
    }, [])
    return (
        <div className='w-full'>
            <h1 className='h-[80px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
                <span>Manage User</span>
            </h1>
            <div className='w-full p-4'>
                <table className='table-auto mb-6 text-left w-full'>
                    <thead className='font-bold bg-gray-600 text-[13px] border border-gray-300 text-center'>
                        <tr className=''>
                            <th className='px-4 py-2'>#</th>
                            <th className='px-4 py-2'>Email</th>
                            <th className='px-4 py-2'>Full name</th>
                            <th className='px-4 py-2'>role</th>
                            <th className='px-4 py-2'>phone</th>
                            <th className='px-4 py-2'>status</th>
                            <th className='px-4 py-2'>CreateAt</th>
                            <th className='px-4 py-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.users?.map((el, idx) => (
                            <tr key={el._id} className='border border-gray-300'>
                                <td className='py-2 px-4'>{idx + 1}</td>
                                <td className='py-2 px-4'>{el.email}</td>
                                <td className='py-2 px-4'>{`${el.firstname} ${el.lastname}`}</td>
                                <td className='py-2 px-4'>{roles.find(role => +role.code === +el.role)?.value}</td>
                                <td className='py-2 px-4'>{el.mobile}</td>
                                <td className='py-2 px-4'>{el.isBlocked ? 'Blocked' : 'Active'}</td>
                                <td className='py-2 px-4'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                                <td className='py-2 px-4'>
                                    <span className='px-2 text-orange-300 hover:underline cursor-pointer'>edit</span>
                                    <span className='px-2 text-orange-300 hover:underline cursor-pointer'>delete</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageUser
