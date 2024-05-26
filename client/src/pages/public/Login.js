import React, { useState, useCallback, useEffect } from "react";
import { InputField, Button, Loading } from '../../components'
import { apiRegister, apiLogin, apiForgotPassword, apiFinalregister } from "../../apis/user";
import Swal from 'sweetalert2'
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import path from "../../ultils/path";
import { login } from '../../store/user/userSlice';
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { validate } from "../../ultils/helpers";
import { showModel } from "store/app/appSlice";

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    // console.log(location)
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        mobile: ''
    })
    const [isVerifiedEmail, setIsVerifiedEmail] = useState(false)
    const [invalidFields, setInvalidFields] = useState([])
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [isRegister, setIsRegister] = useState(false)
    const [searchParams] = useSearchParams()
    console.log(searchParams.get('redirect'))
    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            mobile: ''
        })
    }
    const [token, setToken] = useState('')
    const [email, setEmail] = useState('')
    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email })
        console.log(response)
        if (response.success) {
            toast.success(response.mes, { theme: 'colored' })
        } else {
            toast.info(response.mes, { theme: 'colored' })
        }
    }
    useEffect(() => {
        resetPayload()
    }, [isRegister])

    const handleSubmit = useCallback(async () => {
        const { firstname, lastname, mobile, ...data } = payload
        const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)
        if (invalids === 0) {
            if (isRegister) {

                dispatch(showModel({ isShowModel: true, modelChildren: <Loading /> }))

                const response = await apiRegister(payload)

                dispatch(showModel({ isShowModel: false, modelChildren: null }))

                if (response.success) {
                    setIsVerifiedEmail(true)
                } else Swal.fire('Failed', response.mes, 'error')
            } else {
                const rs = await apiLogin(data)
                if (rs.success) {
                    dispatch(login({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }))
                    searchParams.get('redirect')
                        ? navigate(searchParams.get('redirect'))
                        : navigate(`/${path.HOME}`)
                } else Swal.fire('Failed', rs.mes, 'error')
            }
        }
    }, [payload, isRegister])

    const finalRegister = async () => {
        const response = await apiFinalregister(token)
        console.log(response)
        if (response.success) {
            Swal.fire('Congratulation', response.mes, 'success').then(() => {
                setIsRegister(false)
                resetPayload()
            })
        } else Swal.fire('Failed', response.mes, 'error')
        setIsVerifiedEmail(false)
        setToken('')
    }

    return (
        <div className="w-screen h-screen relative">
            {isVerifiedEmail && <div className="absolute top-0 left-0 bottom-0 right-0 bg-overlay z-50 flex flex-col justify-center items-center" >
                <div className="bg-white w-[500px] rounded-md p-8">
                    <h4 >We sent a code to your mail. Please check mail and enter your OTP code:</h4>
                    <input
                        type="text"
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        className="p-2 border rounded-md outline-none"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 font-semibold text-white rounded-md ml-4"
                        onClick={finalRegister}
                    >
                        Submit
                    </button>
                </div>

            </div>}

            {isForgotPassword && <div className="animate-slide-tr absolute top-0 left-0 bottom-0 right-0 bg-overlay flex flex-col py-20 z-50 items-center">
                <div className="bg-gray-300 p-6 rounded-md">
                    <div className="flex flex-col gap-4">
                        <label className="text-gray-800" htmlFor="email">Enter your email: </label>
                        <input
                            type="text"
                            name=""
                            id="email"
                            className="w-[600px] pb-2 pt-2 border-b outline-none pl-2 placeholder:text-sm"
                            placeholder="Exp: email@gmail.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}

                        />
                        <div className="flex items-center justify-end w-full gap-4">
                            <Button
                                name='Submit'
                                handleOnClick={handleForgotPassword}
                                style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'
                            >Submit</Button>

                            <Button
                                name='Cancle'
                                handleOnClick={() => setIsForgotPassword(false)}

                            >Cancle</Button>
                        </div>
                    </div>
                </div>
            </div>}

            <img
                src="https://i.pinimg.com/originals/f5/43/d7/f543d74332fae1e0fe2cd64f9c0ea2fb.jpg"
                alt=""
                className="w-full h-full object-cover"
            />

            <div className="absolute top-0 bottom-0 left-0 right-1 items-center justify-center flex">
                <div className="flex flex-col items-center p-8 bg-white rounded-md min-w-[500px]">
                    <h1 className="text-[28px] font-semibold text-main mb-8">{isRegister ? 'Regster' : 'Login'}</h1>
                    {isRegister && <div className="flex items-start gap-2">
                        <InputField
                            value={payload.firstname}
                            setValue={setPayload}
                            nameKey='firstname'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />

                        <InputField
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey='lastname'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                    </div>}

                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        fullWidth
                    />

                    {isRegister && <InputField
                        value={payload.mobile}
                        setValue={setPayload}
                        nameKey='mobile'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        fullWidth
                    />}

                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        fullWidth
                    />

                    <Button
                        handleOnClick={handleSubmit}
                        fw
                    >{isRegister ? 'Register' : 'Login'}</Button>
                    <div className="flex items-center justify-between my-2 w-full text-sm">
                        {!isRegister && <span onClick={() => setIsForgotPassword(true)} className="cursor-pointer text-blue-400 hover:underline">Forgot your account?</span>}
                        {!isRegister && <span
                            onClick={() => setIsRegister(true)}
                            className="cursor-pointer text-blue-400 hover:underline">Create new account</span>}

                        {isRegister && <span
                            onClick={() => setIsRegister(false)}
                            className="cursor-pointer w-full text-center text-blue-400 hover:underline">Go to Login</span>}
                    </div>

                    <Link to={`/${path.HOME}`}
                        className="cursor-pointer text-sm text-blue-400 hover:underline"
                    >Go home?</Link>
                </div>
            </div>
        </div>
    )
}
export default Login