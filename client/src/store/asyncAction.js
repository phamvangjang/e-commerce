import { createAsyncThunk } from '@reduxjs/toolkit'
import * as apis from '../apis'

export const getCategories = createAsyncThunk('app/categories', async (data, { rejecWithValue }) => {
    const response = await apis.apiGetCategories()
    if (!response.success) return rejecWithValue(response)
    return response.productCategories
})