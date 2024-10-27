import icons from './icons'
const { FaStar, FaRegStar } = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')
export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString();

export const renderStarFromNumber = (number, size) => {
    if (!Number(number)) return
    const stars = []
    number = Math.round(number)
    for (let i = 0; i < +number; i++) stars.push(<FaStar color='orange' size={size || 16} />)
    for (let i = 5; i > +number; i--) stars.push(<FaRegStar color='orange' size={size || 16} />)
    return stars
}

export function secondsToHms(d) {
    d = Number(d) / 1000
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);
    return ({ h, m, s })
}

export const validate = (payload, setInvalidFields) => {
    let invalids = 0
    const formatPayload = Object.entries(payload)
    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++
            setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Require this field' }])
        }
    }

    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                // const regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!arr[1].match(regex)) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Email invalid.' }])
                }
                //chưa pull cái mới về nè
                if (arr[1].length > 256) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'This email field length too long' }])
                }
                setInvalidFields(prev => [...prev, { name: arr[0], mes: '' }])
                break;

            case 'password':
                if (arr[1].length < 6) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Password minximum 6 characters.' }])
                }
                if (arr[1].length > 29) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Password maximum 29 characters.' }])
                }
                setInvalidFields(prev => [...prev, { name: arr[0], mes: '' }])
                break;
        }
    }
    return invalids
}
export const formatPrice = number => Math.round(number / 1000) * 1000

export const generateRange = (start, end) => {
    const length = end + 1 - start
    return Array.from({ length }, (_, index) => start + index)
}

export function getBase64(file) {
    if (!file) return ''
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
