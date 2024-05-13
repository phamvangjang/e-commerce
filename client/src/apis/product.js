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