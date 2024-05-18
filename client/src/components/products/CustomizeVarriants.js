import InputForm from 'components/inputs/InputForm'
import React, { memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import Button from 'components/buttons/Button'
import { getBase64 } from 'ultils/helpers'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useSelector, useDispatch } from 'react-redux'
import { showModel } from 'store/app/appSlice'
import Loading from 'components/common/Loading'
import { apiAddVarriant } from 'apis'


const CustomizeVarriants = ({ customizeVarriant, setCustomizeVarriant, render }) => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()

    const dispath = useDispatch()

    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })

    // const [hoverElm, setHoverElm] = useState(null)

    // const handleRemoveImage = (name) => {
    //     const files = [...watch('images')]
    //     reset({
    //         images: files?.filter(el => el.name !== name)
    //     })
    //     if (preview.images?.some(el => el.name)) setPreview(prev => ({ ...prev, images: prev.images?.filter(el => el.name !== name) }))
    // }

    useEffect(() => {
        reset({
            title: customizeVarriant?.title,
            color: customizeVarriant?.color,
            price: customizeVarriant?.price,
        })
    }, [customizeVarriant])

    const handleAddVarriant = async (data) => {
        if (data.color === customizeVarriant.color) Swal.fire('Failed!', 'Color not changed!', 'error')
        else {
            const formData = new FormData()
            for (let i of Object.entries(data)) formData.append(i[0], i[1])

            if (data.thumb) formData.append('thumb', data.thumb[0])
            if (data.images) {
                for (let image of data.images) formData.append('images', image)
            }
            dispath(showModel({ isShowModel: true, modelChildren: <Loading /> }))
            const response = await apiAddVarriant(formData, customizeVarriant._id)
            dispath(showModel({ isShowModel: false, modelChildren: null }))
            console.log(response)
        }
    }

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }

    const handlePreviewImages = async (files) => {
        const imagesPreview = []
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('This file is not supported')
                return
            }
            const base64 = await getBase64(file)
            imagesPreview.push(base64)
        }
        setPreview(prev => ({ ...prev, images: imagesPreview }))
    }

    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0)
            handlePreviewThumb(watch('thumb')[0])
    }, [watch('thumb')])

    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0)
            handlePreviewImages(watch('images'))
    }, [watch('images')])
    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className='h-[70px] w-full'></div>
            <div className='right-0 left-[330px] top-0 bg-gray-100 p-4 border-b justify-between items-center border-gray-900 fixed flex'>
                <h1 className='text-3xl font-bold tracking-tight'>Customize varriant of Product</h1>

                <span
                    onClick={() => setCustomizeVarriant(null)}
                    className='text-main hover:underline cursor-pointer text-2xl'>
                    Cancle
                </span>
            </div>
            <div className='p-4'>
                <form
                    onSubmit={handleSubmit(handleAddVarriant)}
                >
                    <div className='w-full flex gap-4 my-6'>
                        <InputForm
                            label='Name Varriant of Product'
                            register={register}
                            errors={errors}
                            id='title'
                            validate={{
                                required: 'Need fill this field'
                            }}
                            placeholder='Enter name of new Varriant Product...'
                            fullWidth
                            style='flex-auto'
                        />
                    </div>
                    <div className='w-full flex gap-4 my-6'>
                        <InputForm
                            label='Price Varriant'
                            register={register}
                            errors={errors}
                            id='price'
                            validate={{
                                required: 'Need fill this field'
                            }}
                            fullWidth
                            placeholder='Enter price of new Varriant Product...'
                            type='number'
                            style='flex-auto'
                        />
                        <InputForm
                            label='Color Varriant'
                            register={register}
                            errors={errors}
                            id='color'
                            validate={{
                                required: 'Need fill this field'
                            }}
                            fullWidth
                            placeholder='Enter color of new Varriant Product...'
                            style='flex-auto'
                        />
                    </div>

                    <div className='flex flex-col gap-2 '>
                        <label className='font-semibold mt-8' htmlFor='thumb'>Upload thumb</label>
                        <input
                            type='file'
                            id='thumb'
                            {...register('thumb', { required: 'Need fill this field' })}
                        />
                        {errors['thumb'] && <small
                            className='text-xs text-main'
                        >
                            {errors['thumb']?.message}
                        </small>}
                    </div>

                    {preview.thumb && <div className='my-4'>
                        <img
                            src={preview.thumb}
                            alt='thumbnail'
                            className='w-[200px] object-contain'
                        />
                    </div>}

                    <div className='flex flex-col gap-2 '>
                        <label className='font-semibold mt-8' htmlFor='product'>Upload images of product</label>
                        <input
                            type='file'
                            id='product'
                            multiple
                            {...register('images', { required: 'Need fill this field' })}
                        />
                        {errors['images'] && <small
                            className='text-xs text-main'
                        >
                            {errors['images']?.message}
                        </small>}
                    </div>

                    {preview.images.length > 0 && <div className='my-4 flex w-full gap-3 flex-wrap'>
                        {preview.images?.map((el, idx) => (
                            <div
                                // onMouseEnter={() => setHoverElm(el.name)}
                                // onMouseLeave={() => setHoverElm(null)}
                                key={idx}
                                className='w-fit relative'>
                                <img
                                    src={el}
                                    alt='product'
                                    className='w-[200px] object-contain'
                                />
                                {/* {hoverElm === el.name && <div
                                    onClick={() => handleRemoveImage(el.name)}
                                    className='cursor-pointer flex items-center justify-center animate-scale-up-center absolute inset-0 bg-overlay'>
                                    <RiDeleteBin6Fill
                                        size={32}
                                        color='white'
                                    />
                                </div>} */}
                            </div>
                        ))}
                    </div>}

                    <div
                        className='my-8'><Button type='submit'>
                            ADD NEW VARRIANT OF PRODUCT
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default memo(CustomizeVarriants)
