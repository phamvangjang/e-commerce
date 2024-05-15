import React, { memo, Fragment, useState } from 'react'
import logo from '../../assets/logo.png'
import { adminSidebar } from 'ultils/contants'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { FaCaretDown, FaCaretRight } from "react-icons/fa";

const activedStyle = 'px-4 py-2 flex items-center text-gray-200 gap-2 bg-gray-500'
const noActivedStyle = 'px-4 py-2 flex items-center text-gray-200 gap-2 hover:bg-gray-400'

const AdminSidebar = () => {
    const [active, setActive] = useState([])
    const handleShowTabs = (tabID) => {
        if (active.some(el => el === tabID)) setActive(prev => prev.filter(el => el !== tabID))
        else setActive(prev => [...prev, tabID])
    }
    return (
        <div className='py-4 bg-zinc-800 h-full'>
            <div className='flex flex-col justify-center items-center py-4 gap-2'>
                <img
                    src={logo}
                    alt='logo'
                    className='w-[200px] object-contain'
                />
                <small>Admin Workspace</small>
            </div>
            <div>
                {adminSidebar.map(el => (
                    <Fragment
                        key={el.id}
                    >
                        {el.type === 'SINGLE' && <NavLink
                            to={el.path}
                            className={({ isActive }) => clsx(isActive && activedStyle, !isActive && noActivedStyle)}
                        >
                            <span>{el.icons}</span>
                            <span>{el.text}</span>
                        </NavLink>}
                        {el.type === 'PARENT' && <div
                            onClick={() => handleShowTabs(el.id)}
                            className=' flex flex-col text-gray-200 '>
                            <div className='flex items-center gap-2 px-4 py-2 hover:bg-gray-400 justify-between'>
                                <div className='flex items-center gap-2 cursor-pointer '>
                                    <span>{el.icons}</span>
                                    <span>{el.text}</span>
                                </div>
                                {active.some(id => id === el.id) ? <FaCaretRight /> : <FaCaretDown />}
                            </div>
                            {active.some(id => id === el.id) && <div
                                className='flex flex-col'>
                                {el.submenu.map(item => (
                                    <NavLink
                                        onClick={e=>e.stopPropagation()}
                                        key={item.text}
                                        to={item.path}
                                        className={({ isActive }) => clsx(isActive && activedStyle, !isActive && noActivedStyle, 'pl-10')}
                                    >
                                        {item.text}

                                    </NavLink>
                                ))}
                            </div>}
                        </div>}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default memo(AdminSidebar)
