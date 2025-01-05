import React, { memo, Fragment, useState } from 'react'
import avatar from '../../assets/avatar-default.png'
import { memberSidebar } from 'ultils/contants'
import { NavLink, } from 'react-router-dom'
import clsx from 'clsx'
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'

const activedStyle = 'px-4 py-2 flex items-center text-gray-900 gap-2 bg-gray-300'
const noActivedStyle = 'px-4 py-2 flex items-center text-gray-900 gap-2 hover:bg-gray-300'

const MemberSidebar = () => {
    const [active, setActive] = useState([])
    const { current } = useSelector(state => state.user)
    const handleShowTabs = (tabID) => {
        if (active.some(el => el === tabID)) setActive(prev => prev.filter(el => el !== tabID))
        else setActive(prev => [...prev, tabID])
    }
    // console.log(current)
    return (
        <div className='py-4 bg-zinc-50 h-full w-[330px] flex-none'>
            <div
                className='flex w-full justify-center items-center py-4 flex-col gap-3'>
                <img
                    src={current?.avatar || avatar}
                    alt='avatar'
                    className='rounded-full w-16 h-16 object-cover'
                />
                <small>{`${current.firstname} ${current.lastname}`}</small>
            </div>
            <div>
                {memberSidebar.map(el => (
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
                            className=' flex flex-col text-gray-900 '>
                            <div className='flex items-center gap-2 px-4 py-2 hover:bg-gray-300 justify-between'>
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
                                        onClick={e => e.stopPropagation()}
                                        key={item.text}
                                        to={item.path}
                                        className={({ isActive }) => clsx(isActive && activedStyle, !isActive && noActivedStyle, 'pl-10')}>
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

export default memo(MemberSidebar)
