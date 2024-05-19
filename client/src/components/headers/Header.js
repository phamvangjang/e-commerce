import React, { Fragment, useEffect, useState } from "react";
import logo from '../../assets/logo.png'
import icons from '../../ultils/icons'
import { Link } from 'react-router-dom'
import path from '../../ultils/path'
import { useDispatch, useSelector } from "react-redux";
import { logout } from "store/user/userSlice";

const { RiPhoneFill, MdEmail, FaShoppingCart, FaCircleUser } = icons
const Header = () => {
    const { current } = useSelector(state => state.user)
    const [isShowOption, setIsShowOption] = useState(false)
    const dispath = useDispatch()
    useEffect(() => {
        const handleClickoutOptions = (e) => {
            const profile = document.getElementById('profile')
        }

        document.addEventListener('click', handleClickoutOptions)

        return () => {
            document.removeEventListener('click', handleClickoutOptions)
        }
    }, [])
    return (
        <div className='flex justify-between w-main h-[110px] py-[35px]'>
            <Link to={`/${path.HOME}`}>
                <img src={logo} alt="logo" className='w-[234px] object-contain' />
            </Link>

            <div className='flex text-[13px]'>
                <div className='flex flex-col items-center px-6 border-r'>
                    <span className='flex gap-4 items-center'>
                        <RiPhoneFill color='red' />
                        <span className='font-semibold'> (+1800) 000 8808</span>
                    </span>
                    <span>
                        Mon-Sat 9:00AM - 8:00PM
                    </span>
                </div>
                <div className='flex flex-col items-center px-6 border-r'>
                    <span className='flex gap-4 items-center'>
                        <MdEmail color='red' />
                        <span className='font-semibold'> SUPPORT@TADATHEMES.COM</span>
                    </span>
                    <span>
                        Online Support 24/7
                    </span>
                </div>

                {current && <Fragment>
                    <div className='flex items-center justify-center px-6 border-r gap-2 cursor-pointer'>
                        <FaShoppingCart color='red' />
                        <span>0 item(s)</span>
                    </div>

                    <div
                        id="profile"
                        onClick={() => setIsShowOption(prev => !prev)}
                        className='flex items-center justify-center px-6 gap-2 cursor-pointer relative'>
                        <FaCircleUser size={24} color="red" />
                        <span>Profile</span>
                        {isShowOption && <div
                            onClick={e => e.stopPropagation()}
                            className="flex flex-col absolute top-full left-[16px] bg-gray-50 border min-w-[150px] ">
                            <Link
                                className="p-2 hover:text-main hover:bg-sky-50 w-full"
                                to={`/${path.MEMBER}/${path.PERSONAL}`}>
                                Personal
                            </Link>
                            {+current?.role === 1973 && <Link
                                className="p-2 hover:text-main hover:bg-sky-50 w-full"
                                to={`${path.ADMIN}/${path.DASHBOARD}`}>
                                Admin workspace
                            </Link>}
                            <span
                                onClick={() => dispath(logout())}
                                className="border-t border-gray-300 p-2 hover:text-main hover:bg-sky-50 w-full">
                                Logout
                            </span>
                        </div>}
                    </div>
                </Fragment>}

            </div>
        </div>
    )
}
export default Header