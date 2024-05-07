import React, { useState, useCallback } from "react";
import { InputField, Button } from '../../components'
const Login = () => {
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        name: ''
    })
    const [isRegister, setIsRegister] = useState(false)
    const handleSubmit = useCallback(() => {

    }, [payload])
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
                    {isRegister && <InputField
                        value={payload.name}
                        setValue={setPayload}
                        nameKey='name'
                    />}

                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                    />

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