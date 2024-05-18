import { InputForm, MarkdownEditor, Button, Loading, Select } from 'components'
import React, { memo, useState, useEffect, useCallback } from 'react'
import { set, useForm } from 'react-hook-form'
import { validate, getBase64 } from 'ultils/helpers'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { showModel } from 'store/app/appSlice'
import { apiUpdateProduct } from 'apis'

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()

    const dispath = useDispatch()
    const { categories } = useSelector(state => state.app)

    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })

    const [payload, setPayload] = useState({
        description: ''
    })

    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [payload])

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }

    //bug ko show len duoc 2 hinh
    const handlePreviewImages = async (files) => {
        const imagesPreview = []
        for (let file of files) {
            // console.log(file.type)
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
        reset({
            title: editProduct?.title || '',
            price: editProduct?.price || '',
            quantity: editProduct?.quantity || '',
            color: editProduct?.color || '',
            category: editProduct?.category || '',
            brand: editProduct?.brand?.toLowerCase() || '',
        })
        setPayload({
            description: typeof editProduct?.description === 'object'
                ? editProduct?.description?.join(',')
                : editProduct?.description
        })
        setPreview({
            thumb: editProduct?.thumb || '',
            images: editProduct?.images || []
        })
    }, [editProduct])

    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0)
            handlePreviewThumb(watch('thumb')[0])
    }, [watch('thumb')])

    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0)
            handlePreviewImages(watch('images'))
    }, [watch('images')])

    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el.title === data.category)?.title
            const finalPayload = { ...data, ...payload }

            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])

            if (finalPayload.thumb) formData.append('thumb',
                finalPayload?.thumb?.length === 0
                    ? preview.thumb
                    : finalPayload.thumb[0])
            if (finalPayload.images) {
                const images = finalPayload?.image?.length === 0
                    ? preview.images
                    : finalPayload.images
                for (let image of images) formData.append('images', image)
            }

            
            dispath(showModel({ isShowModel: true, modelChildren: <Loading /> }))
            const response = await apiUpdateProduct(formData, editProduct._id)
            dispath(showModel({ isShowModel: false, modelChildren: null }))
            console.log(response)

            if (response.success) {
                toast.success(response.mes)
                render()
                setEditProduct(null)
            } else toast.error(response.mes)
        }
    }
    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className='h-[70px] w-full'></div>
            <div className='right-0 left-[330px] top-0 bg-gray-100 p-4 border-b justify-between items-center border-gray-900 fixed flex'>
                <h1 className='text-3xl font-bold tracking-tight'>Update Product</h1>

                <span
                    onClick={() => setEditProduct(null)}
                    className='text-main hover:underline cursor-pointer text-2xl'>
                    Cancle
                </span>
            </div>

            <div className='p-4'>
                <form
                    onSubmit={handleSubmit(handleUpdateProduct)}
                >
                    <InputForm
                        label='Name Product'
                        register={register}
                        errors={errors}
                        id='title'
                        validate={{
                            required: 'Need fill this field'
                        }}
                        fullWidth
                        placeholder='Enter name of new Product...'
                    />
                    <div className='w-full flex gap-4 my-6'>
                        <InputForm
                            label='Price'
                            register={register}
                            errors={errors}
                            id='price'
                            validate={{
                                required: 'Need fill this field'
                            }}
                            fullWidth
                            placeholder='Enter price of new Product...'
                            type='number'
                            style='flex-auto'

                        />

                        <InputForm
                            label='Quantity'
                            register={register}
                            errors={errors}
                            id='quantity'
                            validate={{
                                required: 'Need fill this field'
                            }}
                            fullWidth
                            placeholder='Enter price of new Product...'
                            type='number'
                            style='flex-auto'
                        />

                        <InputForm
                            label='Color'
                            register={register}
                            errors={errors}
                            id='color'
                            validate={{
                                required: 'Need fill this field'
                            }}
                            fullWidth
                            placeholder='Enter color of new Product...'
                            style='flex-auto'
                        />
                    </div>
                    <div className='w-full flex gap-4 my-6'>
                        <Select
                            label='Category'
                            options={categories?.map(el => ({ code: el.title, value: el.title }))}
                            register={register}
                            id='category'
                            validate={{
                                required: 'Need fill this field'
                            }}
                            style='flex-auto'
                            errors={errors}
                            fullWidth
                        />

                        <Select
                            label='Brand (Optional)'
                            options={categories?.find(el => el.title === watch('category'))?.brand?.map(el => ({ code: el.toLowerCase(), value: el }))}
                            register={register}
                            id='brand'
                            style='flex-auto'
                            errors={errors}
                            fullWidth
                        />
                    </div>
                    <MarkdownEditor
                        name='description'
                        changeValue={changeValue}
                        label='Description'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        value={payload.description}
                    />
                    <div className='flex flex-col gap-2 '>
                        <label className='font-semibold mt-8' htmlFor='thumb'>Upload thumb</label>
                        <input
                            type='file'
                            id='thumb'
                            {...register('thumb')}
                        />
                        {errors['thumb'] && <small
                            className='text-xs text-main'>
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
                            {...register('images')}
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
                                key={idx}
                                className='w-fit relative'>
                                <img
                                    src={el}
                                    alt='product'
                                    className='w-[200px] object-contain'
                                />

                            </div>
                        ))}
                    </div>}

                    <div className='my-8'><Button type='submit'>UPDATE NEW PRODUCT</Button></div>
                </form>
            </div>
        </div>
    )
}

export default memo(UpdateProduct)
