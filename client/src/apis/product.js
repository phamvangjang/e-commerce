import axois from '../axios'

export const apiGetProducts = (params) => axois({
    url: '/product/',
    method: 'get',
    params
})

export const apiGetProduct = (pid) => axois({
    url: '/product/' + pid,
    method: 'get',
})

export const apiRatings = (data) => axois({
    url: '/product/ratings',
    method: 'put',
    data
})

export const apiCreateProduct = (data) => axois({
    url: '/product/',
    method: 'post',
    data
})

export const apiUpdateProduct = (data, pid) => axois({
    url: '/product/' + pid,
    method: 'put',
    data
})

export const apiDeleteProduct = (pid) => axois({
    url: '/product/' + pid,
    method: 'delete',
})

export const apiAddVarriant = (data, pid) => axois({
    url: '/product/varriant/' + pid,
    method: 'put',
    data
})

export const apiCreateOrder = (data) => axois({
    url: '/order/',
    method: 'post',
    data
})