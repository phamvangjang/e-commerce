import { createAsyncThunk } from '@reduxjs/toolkit'
import * as apis from '../../apis'

export const getNewProducts = createAsyncThunk('product/newProducts', async (data, { rejecWithValue }) => {
    const response = await apis.apiGetProducts({sort: '-createdAt'})
    if (!response.success) return rejecWithValue(response)
    return response.products
})