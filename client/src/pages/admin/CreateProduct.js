import React, { useCallback, useEffect, useState } from 'react'
import { InputForm, Select, Button, MarkdownEditor, Loading } from 'components'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { validate, getBase64 } from 'ultils/helpers'
import { toast } from 'react-toastify'
import { RiDeleteBin6Fill } from "react-icons/ri";
import { apiCreateProduct } from 'apis'
import { showModel } from 'store/app/appSlice'

const CreateProduct = () => {
    const dispath = useDispatch()
    const { categories } = useSelector(state => state.app)
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()

    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })

    const [payload, setPayload] = useState({
        description: ''
    })

    const [hoverElm, setHoverElm] = useState(null)

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
            console.log(file.type)
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('This file is not supported')
                return
            }
            const base64 = await getBase64(file)
            imagesPreview.push({ name: file.name, path: base64 })
        }
        setPreview(prev => ({ ...prev, images: imagesPreview }))
    }

    useEffect(() => {
        handlePreviewThumb(watch('thumb')[0])
    }, [watch('thumb')])

    useEffect(() => {
        handlePreviewImages(watch('images'))
    }, [watch('images')])
    // console.log(preview)

    const handleCreateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el._id === data.category)?.title
            const finalPayload = { ...data, ...payload }
            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])

            if (finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0])
            if (finalPayload.images) {
                for (let image of finalPayload.images) formData.append('images', image)
            }

            // Display the key/value pairs
            // for (var pair of formData.entries()) {
            //     console.log(pair[0] + ', ' + pair[1]);
            // }
            dispath(showModel({ isShowModel: true, modelChildren: <Loading /> }))
            const response = await apiCreateProduct(formData)
            dispath(showModel({ isShowModel: false, modelChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                reset()
                setPayload({
                    thumb: '',
                    images: []
                })
            } else toast.error(response.mes)
        }
    }

    const handleRemoveImage = (name) => {
        const files = [...watch('images')]
        reset({
            images: files?.filter(el => el.name !== name)
        })
        if (preview.images?.some(el => el.name)) setPreview(prev => ({ ...prev, images: prev.images?.filter(el => el.name !== name) }))
    }
    // console.log(watch('category'))
    // console.log(categories)
    return (
        <div className='w-full'>
            <h1 className='h-[80px] flex justify-between items-center text-3xl font-bold px-4 border-b border-gray-900 '>
                <span>Create New Product</span>
            </h1>
            <div className='p-4'>
                <form
                    onSubmit={handleSubmit(handleCreateProduct)}
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
                            options={categories?.map(el => ({ code: el._id, value: el.title }))}
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
                            options={categories?.find(el => el._id === watch('category'))?.brand?.map(el => ({ code: el, value: el }))}
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
                    />
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
                                onMouseEnter={() => setHoverElm(el.name)}
                                onMouseLeave={() => setHoverElm(null)}
                                key={idx}
                                className='w-fit relative'>
                                <img
                                    src={el.path}
                                    alt='product'
                                    className='w-[200px] object-contain'
                                />
                                {hoverElm === el.name && <div
                                    onClick={() => handleRemoveImage(el.name)}
                                    className='cursor-pointer flex items-center justify-center animate-scale-up-center absolute inset-0 bg-overlay'>
                                    <RiDeleteBin6Fill
                                        size={32}
                                        color='white'
                                    />
                                </div>}
                            </div>
                        ))}
                    </div>}

                    <div className='my-8'><Button type='submit'>CREATE NEW PRODUCT</Button></div>
                </form>
            </div>
        </div>
    )
}

export default CreateProduct
