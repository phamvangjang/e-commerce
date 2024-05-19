import { Button, InputForm, Loading } from 'components'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import avatar from '../../assets/avatar-default.png'
import { apiUpdateCurrent } from 'apis'
import { getCurrent } from 'store/user/asyncActions'
import { toast } from 'react-toastify'
import { showModel } from 'store/app/appSlice'

const Personal = () => {
    const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm()
    const { current } = useSelector(state => state.user)
    const dispath = useDispatch()
    useEffect(() => {
        reset({
            firstname: current?.firstname,
            lastname: current?.lastname,
            email: current?.email,
            mobile: current?.mobile,
            avatar: current?.avatar,
        })
    }, [current])

    const handleUpdateInfor = async (data) => {
        const formData = new FormData()
        if (data.avatar.length > 0) formData.append('avatar', data.avatar[0])
        delete data.avatar
        for (let i of Object.entries(data)) formData.append(i[0], i[1])
        
        dispath(showModel({ isShowModel: true, modelChildren: <Loading /> }))

        const response = await apiUpdateCurrent(formData)
        dispath(showModel({ isShowModel: false, modelChildren: null }))

        // console.log(response)
        if (response.success) {
            dispath(getCurrent())
            toast.success(response.mes)
        } else toast.error(response.mes)
        // console.log(data)
    }
    return (
        <div
            className='w-full relative px-4'>
            <header
                className='text-3xl font-semibold py-4 border-b border-gray-500'>
                Personal
            </header>

            <form
                onSubmit={handleSubmit(handleUpdateInfor)}
                className='w-3/5 mx-auto py-8 flex flex-col gap-4'>
                <InputForm
                    label='FirstName'
                    register={register}
                    errors={errors}
                    id='firstname'
                    validate={{
                        required: 'Need fill this field'
                    }}
                />

                <InputForm
                    label='LastName'
                    register={register}
                    errors={errors}
                    id='lastname'
                    validate={{
                        required: 'Need fill this field'
                    }}
                />

                <InputForm
                    label='Email Address'
                    register={register}
                    errors={errors}
                    id='email'
                    validate={{
                        required: 'Need fill this field'
                    }}
                    disabled={true}
                />
                <InputForm
                    label='Phone'
                    register={register}
                    errors={errors}
                    id='mobile'
                    validate={{
                        required: 'Need fill this field',
                        pattern: {
                            value: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
                            message: 'Phone Invalid'
                        }
                    }}
                />
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Account status:</span>
                    <span>{current?.isBlocked ? 'Blocked' : 'Active'}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Create At:</span>
                    <span>{moment(current?.createdAt).fromNow()}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Profile image:</span>
                    <label htmlFor='file'>
                        <img
                            src={current?.avatar || avatar}
                            alt='avatar'
                            className='w-16 h-16 object-cover cursor-pointer'
                        />
                    </label>
                    <input
                        type='file'
                        id='file'
                        hidden
                        {...register('avatar')}
                    />
                </div>

                {isDirty && <div className='w-full flex justify-end'><Button type='submit'>Update Information</Button></div>}
            </form>
        </div>
    )
}

export default Personal
