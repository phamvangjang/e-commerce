import axois from '../axios'

export const apiGetProducts = (params) =>axois({
    url: '/product/',
    method: 'get',
    params
})