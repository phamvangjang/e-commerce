import React, { useState } from 'react'
import { Button } from '../../components'
import { useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const { token } = useParams()
    const handleForgotPassword = async () => {
        const response = await apiResetPassword({ password, token })
        if (response.success) {
            toast.success(response.mes, { theme: 'colored' })
        } else {
            toast.info(response.mes, { theme: 'colored' })
        }
    }
    return (
        <div className="animate-slide-tr absolute top-0 left-0 bottom-0 right-0 bg-overlay flex flex-col py-20 z-50 items-center">
            <div className="bg-gray-300 p-6 rounded-md">
                <div className="flex flex-col gap-4">
                    <label className="text-gray-800" htmlFor="password">Enter your new Password: </label>
                    <input
                        type="password"
                        name=""
                        id="password"
                        className="w-[600px] pb-2 pt-2 border-b outline-none pl-2 placeholder:text-sm"
                        placeholder="New Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}

                    />
                    <div className="flex items-center justify-end w-full gap-4">
                        <Button
                            name='Submit'
                            handleOnClick={handleForgotPassword}
                            style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
