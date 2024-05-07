import React, { useState, useCallback } from "react";
import { InputField, Button } from '../../components'
import { apiRegister, apiLogin } from "../../apis/user";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import { register } from '../../store/user/userSlice';
import { useDispatch } from "react-redux";

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        mobile: ''
    })
    const [isRegister, setIsRegister] = useState(false)
    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            mobile: ''
        })
    }
    const handleSubmit = useCallback(async () => {
        const { firstname, lastname, mobile, ...data } = payload
        if (isRegister) {
            const response = await apiRegister(payload)
            if (response.success) {
                Swal.fire('Congratulation', response.mes, 'success').then(() => {
                    setIsRegister(false)
                    resetPayload()
                })
            } else Swal.fire('Failed', response.mes, 'error')

            // Swal.fire(response.success ? 'Congratulation' : 'Failed', response.mes, response.success ? 'success' : 'error').then(() => {
            //     setIsRegister(false)
            //     resetPayload()
            // })
        } else {
            const rs = await apiLogin(data)
            if (rs.success) {
                dispatch(register({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }))
                navigate(`/${path.HOME}`)
            } else Swal.fire('Failed', rs.mes, 'error')
        }
    }, [payload, isRegister])
    return (
        <div className="w-screen h-screen relative">
            <img
                src="https://i.pinimg.com/originals/f5/43/d7/f543d74332fae1e0fe2cd64f9c0ea2fb.jpg"
                alt=""
                className="w-full h-full object-cover"
            />
            <div className="absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex">
                <div className="flex flex-col items-center p-8 bg-white rounded-md min-w-[500px]">
                    <h1 className="text-[28px] font-semibold text-main mb-8">{isRegister ? 'Regster' : 'Login'}</h1>
                    {isRegister && <div className="flex items-start gap-2">
                        <InputField
                            value={payload.firstname}
                            setValue={setPayload}
                            nameKey='firstname'
                        />

                        <InputField
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey='lastname'
                        />
                    </div>}

                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                    />

                    {isRegister && <InputField
                        value={payload.mobile}
                        setValue={setPayload}
                        nameKey='mobile'
                    />}

                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                    />

                    <Button
                        name={isRegister ? 'Register' : 'Login'}
                        handleOnClick={handleSubmit}
                        fw
                    />
                    <div className="flex items-center justify-between my-2 w-full text-sm">
                        {!isRegister && <span className="cursor-pointer text-blue-400 hover:underline">Forgot your account?</span>}
                        {!isRegister && <span
                            onClick={() => setIsRegister(true)}
                            className="cursor-pointer text-blue-400 hover:underline">Create new account</span>}

                        {isRegister && <span
                            onClick={() => setIsRegister(false)}
                            className="cursor-pointer w-full text-center text-blue-400 hover:underline">Go to Login</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login