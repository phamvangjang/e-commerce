import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";
import icons from "ultils/icons";
const { MdArrowForwardIos } = icons

const FAQ = ()=>{
    return (
        <div className={clsx("w-full ")}>
            <div className="h-[80px] flex justify-center items-center bg-gray-200">
                <div
                    className="w-main flex flex-col justify-center gap-1">
                    <h3 className="font-bold uppercase">about us</h3>
                    <div className='flex items-center gap-1'>
                        <Link to={`${'/'}`} className='hover:text-main uppercase'>home</Link>
                        <span ><MdArrowForwardIos /></span>
                        <span className='uppercase'>faqs</span>
                    </div>
                </div>
            </div>
            <div className="h-[300px]"></div>
        </div>
    )
}
export default FAQ