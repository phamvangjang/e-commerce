import React, { useCallback, useState } from 'react'
import { InputForm, Select, Button, MarkdownEditor } from 'components'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { validate } from 'ultils/helpers'

const CreateProduct = () => {
    const { categories } = useSelector(state => state.app)
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()


    const [payload, setPayload] = useState({
        description: ''
    })
    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [payload])

    const handleCreateProduct = (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el._id === data.category)?.title
            const finalPayload = { ...data, ...payload }
            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])

            // Display the key/value pairs
            for (var pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

        }
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
                    <div className='my-8'><Button type='submit'>CREATE NEW PRODUCT</Button></div>
                </form>
            </div>
        </div>
    )
}

export default CreateProduct
